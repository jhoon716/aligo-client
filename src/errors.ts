export interface AligoErrorContext {
  status?: number;
  resultCode?: number;
  endpoint?: string;
  details?: unknown;
  cause?: unknown;
}

const SECRET_PLACEHOLDER = '***';

export function maskSecret(value: string, visibleTail = 2): string {
  if (!value) return SECRET_PLACEHOLDER;
  const safeTail = Math.max(0, Math.min(visibleTail, value.length));
  const masked = value.slice(-safeTail);
  return `${SECRET_PLACEHOLDER}${masked}`;
}

export class AligoError extends Error {
  status?: number;
  resultCode?: number;
  endpoint?: string;
  details?: unknown;

  constructor(message: string, context: AligoErrorContext = {}) {
    super(message, context.cause ? { cause: context.cause } : undefined);
    this.name = 'AligoError';
    this.status = context.status;
    this.resultCode = context.resultCode;
    this.endpoint = context.endpoint;
    this.details = context.details;
  }
}

export function isAligoError(error: unknown): error is AligoError {
  return error instanceof Error && error.name === 'AligoError';
}
