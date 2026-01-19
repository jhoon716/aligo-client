import type { RemainResponse } from '../types.js';
import { HttpClient } from '../http/client.js';

export function createStatusNamespace(http: HttpClient) {
  return {
    getRemain: () => getRemain(http),
  };
}

async function getRemain(http: HttpClient): Promise<RemainResponse> {
  return http.post<RemainResponse>({
    path: '/remain/',
    fields: {},
  });
}
