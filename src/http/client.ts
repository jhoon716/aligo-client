import { AligoError, maskSecret } from '../errors.js';
import type { Attachment, RetryOptions } from '../types.js';

type FieldValue = string | number | undefined;

const DEFAULT_TIMEOUT_MS = 30000;

interface RequestOptions {
  path: string;
  fields: Record<string, FieldValue>;
  attachments?: Record<string, Attachment | undefined>;
}

export interface HttpClientConfig {
  key: string;
  userId: string;
  baseUrl: string;
  timeoutMs?: number;
  retry?: RetryOptions;
  authKeyField?: string;
  authUserIdField?: string;
}

export class HttpClient {
  private readonly key: string;
  private readonly userId: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly retry: Required<RetryOptions>;
  private readonly authKeyField: string;
  private readonly authUserIdField: string;

  constructor(options: HttpClientConfig) {
    this.key = options.key;
    this.userId = options.userId;
    this.baseUrl = options.baseUrl;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.authKeyField = options.authKeyField ?? 'key';
    this.authUserIdField = options.authUserIdField ?? 'user_id';

    const retries = options.retry?.retries ?? 0;
    const factor = options.retry?.factor ?? 2;
    const minTimeoutMs = options.retry?.minTimeoutMs ?? 300;
    this.retry = { retries, factor, minTimeoutMs };
  }

  async post<TResponse>(options: RequestOptions): Promise<TResponse> {
    const url = new URL(options.path, this.baseUrl).toString();
    const fields: Record<string, FieldValue> = {
      [this.authKeyField]: this.key,
      [this.authUserIdField]: this.userId,
      ...options.fields,
    };

    const bodyInfo = buildBody(fields, options.attachments);

    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      body: bodyInfo.body,
      headers: bodyInfo.headers,
    });

    const parsed = await parseJson(response);
    const resultCode = getResultCode(parsed);

    if (!response.ok) {
      throw new AligoError(`HTTP error ${response.status} on ${options.path}`, {
        status: response.status,
        resultCode,
        endpoint: options.path,
        details: parsed ?? undefined,
      });
    }

    if (resultCode !== undefined && resultCode < 0) {
      throw new AligoError(`Aligo API error ${resultCode} on ${options.path}`, {
        resultCode,
        endpoint: options.path,
        details: parsed ?? undefined,
      });
    }

    return parsed as TResponse;
  }

  private async fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
    let attempt = 0;
    let delay = this.retry.minTimeoutMs;
    let lastError: unknown;

    while (attempt <= this.retry.retries) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await fetch(url, { ...init, signal: controller.signal });
        clearTimeout(timeout);

        if (shouldRetryResponse(response) && attempt < this.retry.retries) {
          attempt += 1;
          await sleep(delay);
          delay *= this.retry.factor ?? 2;
          continue;
        }

        return response;
      } catch (error) {
        clearTimeout(timeout);
        if (attempt >= this.retry.retries || !shouldRetryError(error)) {
          if (error instanceof Error && error.message?.includes(this.key)) {
            error.message = error.message.replace(this.key, maskSecret(this.key));
          }
          throw error;
        }
        lastError = error;
        attempt += 1;
        await sleep(delay);
        delay *= this.retry.factor ?? 2;
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Request failed');
  }
}

function buildBody(
  fields: Record<string, FieldValue>,
  attachments?: Record<string, Attachment | undefined>,
): { body: BodyInit; headers?: HeadersInit } {
  const hasAttachments = attachments
    ? Object.values(attachments).some((attachment) => Boolean(attachment))
    : false;

  if (hasAttachments) {
    const form = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) form.append(key, String(value));
    });

    Object.entries(attachments ?? {}).forEach(([field, attachment]) => {
      if (!attachment) return;
      const file = toFile(attachment);
      if (file) {
        form.append(field, file, 'name' in file ? file.name : undefined);
      }
    });

    return { body: form };
  }

  const params = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) params.append(key, String(value));
  });
  return {
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  };
}

function toFile(attachment: Attachment): File | Blob {
  const { data, filename, contentType } = attachment;

  if (data instanceof File) {
    return data;
  }

  if (data instanceof Blob && !filename) {
    return data;
  }

  const blob =
    data instanceof Blob
      ? data
      : new Blob([data as BlobPart], contentType ? { type: contentType } : undefined);

  if (filename) {
    return new File([blob], filename, {
      type: contentType ?? blob.type,
    });
  }

  return blob;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new AligoError(`Failed to parse JSON response from ${response.url}`, {
      status: response.status,
      cause: error,
    });
  }
}

function shouldRetryResponse(response: Response): boolean {
  return response.status >= 500 && response.status < 600;
}

function getResultCode(payload: unknown): number | undefined {
  if (payload && typeof payload === 'object' && 'code' in (payload as Record<string, unknown>)) {
    const value = (payload as Record<string, unknown>).code;
    if (typeof value === 'number') {
      return value;
    }
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'result_code' in (payload as Record<string, unknown>)
  ) {
    const value = (payload as Record<string, unknown>).result_code;
    if (typeof value === 'number') {
      return value;
    }
  }
  return undefined;
}

function shouldRetryError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return false;
  if (error instanceof Error && error.name === 'AbortError') return false;
  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
