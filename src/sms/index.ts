import { AligoError } from '../errors.js';
import type {
  CancelParams,
  CancelResponse,
  ListMessagesParams,
  ListResponse,
  SendMassParams,
  SendMessageParams,
  SendResponse,
  SmsListParams,
  SmsListResponse,
} from '../types.js';
import { HttpClient } from '../http/client.js';

export function createSmsNamespace(http: HttpClient) {
  return {
    send: (params: SendMessageParams) => send(http, params),
    sendMass: (params: SendMassParams) => sendMass(http, params),
    list: (params?: ListMessagesParams) => list(http, params),
    getDetails: (params: SmsListParams) => getDetails(http, params),
    cancel: (params: CancelParams) => cancel(http, params),
  };
}

async function send(http: HttpClient, params: SendMessageParams): Promise<SendResponse> {
  const fields: Record<string, string | number | undefined> = {
    sender: params.sender,
    receiver: params.receiver,
    msg: params.msg,
    msg_type: params.msgType,
    title: params.title,
    destination: params.destination,
    rdate: params.rdate,
    rtime: params.rtime,
    testmode_yn: params.testmodeYn,
  };

  return http.post<SendResponse>({
    path: '/send/',
    fields,
    attachments: {
      image1: params.image1,
      image2: params.image2,
      image3: params.image3,
    },
  });
}

async function sendMass(http: HttpClient, params: SendMassParams): Promise<SendResponse> {
  if (!params.messages.length) {
    throw new AligoError('messages must include at least 1 entry');
  }

  if (params.messages.length > 500) {
    throw new AligoError('messages cannot exceed 500 entries');
  }

  const fields: Record<string, string | number | undefined> = {
    sender: params.sender,
    msg_type: params.msgType,
    title: params.title,
    rdate: params.rdate,
    rtime: params.rtime,
    testmode_yn: params.testmodeYn,
    cnt: params.messages.length,
  };

  params.messages.forEach((entry, index) => {
    const idx = index + 1;
    fields[`rec_${idx}`] = entry.receiver;
    fields[`msg_${idx}`] = entry.msg;
  });

  return http.post<SendResponse>({
    path: '/send_mass/',
    fields,
    attachments: {
      image1: params.image1,
      image2: params.image2,
      image3: params.image3,
    },
  });
}

async function list(http: HttpClient, params?: ListMessagesParams): Promise<ListResponse> {
  const fields: Record<string, string | number | undefined> = {
    page: params?.page,
    page_size: params?.pageSize,
    start_date: params?.startDate,
    limit_day: params?.limitDay,
  };

  return http.post<ListResponse>({
    path: '/list/',
    fields,
  });
}

async function getDetails(http: HttpClient, params: SmsListParams): Promise<SmsListResponse> {
  const fields: Record<string, string | number | undefined> = {
    mid: params.mid,
    page: params.page,
    page_size: params.pageSize,
  };

  return http.post<SmsListResponse>({
    path: '/sms_list/',
    fields,
  });
}

async function cancel(http: HttpClient, params: CancelParams) {
  const fields: Record<string, string | number | undefined> = {
    mid: params.mid,
  };

  return http.post<CancelResponse>({
    path: '/cancel/',
    fields,
  });
}
