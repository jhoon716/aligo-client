import { AligoError } from './errors.js';
import { HttpClient } from './http/client.js';
import type { HttpClientConfig } from './http/client.js';
import { createSmsNamespace } from './sms/index.js';
import { createStatusNamespace } from './status/index.js';
import { createKakaoNamespace } from './kakao/index.js';
import type { AligoClient, AligoClientOptions } from './types.js';

const DEFAULT_SMS_BASE = 'https://apis.aligo.in';
const DEFAULT_KAKAO_BASE = 'https://kakaoapi.aligo.in';

export function createAligoClient(options: AligoClientOptions): AligoClient {
  if (!options?.key) {
    throw new AligoError('key is required to create an Aligo client');
  }

  if (!options?.userId) {
    throw new AligoError('userId is required to create an Aligo client');
  }

  const smsConfig: HttpClientConfig = {
    key: options.key,
    userId: options.userId,
    baseUrl: options.baseUrl ?? DEFAULT_SMS_BASE,
    timeoutMs: options.timeoutMs,
    retry: options.retry,
    authKeyField: 'key',
    authUserIdField: 'user_id',
  };

  const kakaoConfig: HttpClientConfig = {
    key: options.key,
    userId: options.userId,
    baseUrl: options.kakaoBaseUrl ?? DEFAULT_KAKAO_BASE,
    timeoutMs: options.timeoutMs,
    retry: options.retry,
    authKeyField: 'apikey',
    authUserIdField: 'userid',
  };

  const smsHttp = new HttpClient(smsConfig);
  const kakaoHttp = new HttpClient(kakaoConfig);

  return {
    sms: createSmsNamespace(smsHttp),
    status: createStatusNamespace(smsHttp),
    kakao: createKakaoNamespace(kakaoHttp),
  };
}
