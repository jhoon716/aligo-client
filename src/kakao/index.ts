import { AligoError } from '../errors.js';
import type {
  CancelParams,
  Attachment,
  KakaoAlimtalkSendParams,
  KakaoBaseResponse,
  KakaoCategoryResponse,
  KakaoCreateTemplateParams,
  KakaoFriendtalkCarouselParams,
  KakaoFriendtalkSendParams,
  KakaoFriendtalkWideListParams,
  KakaoHistoryDetailParams,
  KakaoHistoryDetailResponse,
  KakaoHistoryListParams,
  KakaoHistoryListResponse,
  KakaoProfileAddParams,
  KakaoProfileAuthParams,
  KakaoProfileListParams,
  KakaoProfileListResponse,
  KakaoRemainResponse,
  KakaoSendResponse,
  KakaoTemplateListParams,
  KakaoTemplateListResponse,
  KakaoTemplateResponse,
  KakaoUpdateTemplateParams,
} from '../types.js';
import { HttpClient } from '../http/client.js';

export function createKakaoNamespace(http: HttpClient) {
  return {
    profile: {
      requestAuth: (params: KakaoProfileAuthParams) => requestProfileAuth(http, params),
      requestAdd: (params: KakaoProfileAddParams) => requestProfileAdd(http, params),
      getCategories: () => getCategories(http),
      list: (params?: KakaoProfileListParams) => listProfiles(http, params),
    },
    templates: {
      list: (params: KakaoTemplateListParams) => listTemplates(http, params),
      create: (params: KakaoCreateTemplateParams) => createTemplate(http, params),
      update: (params: KakaoUpdateTemplateParams) => updateTemplate(http, params),
      delete: (params: { senderKey: string; templateCode: string }) => deleteTemplate(http, params),
      requestReview: (params: { senderKey: string; templateCode: string }) =>
        requestTemplateReview(http, params),
    },
    sendAlimtalk: (params: KakaoAlimtalkSendParams) => sendAlimtalk(http, params),
    sendFriendtalk: (params: KakaoFriendtalkSendParams) => sendFriendtalk(http, params),
    sendFriendtalkWideList: (params: KakaoFriendtalkWideListParams) =>
      sendFriendtalkWideList(http, params),
    sendFriendtalkCarousel: (params: KakaoFriendtalkCarouselParams) =>
      sendFriendtalkCarousel(http, params),
    history: {
      list: (params?: KakaoHistoryListParams) => listHistory(http, params),
      detail: (params: KakaoHistoryDetailParams) => detailHistory(http, params),
    },
    remain: () => getRemain(http),
    cancel: (params: CancelParams) => cancel(http, params),
  };
}

async function requestProfileAuth(
  http: HttpClient,
  params: KakaoProfileAuthParams,
): Promise<KakaoBaseResponse> {
  return http.post<KakaoBaseResponse>({
    path: '/akv10/profile/auth/',
    fields: {
      plusid: params.plusId,
      phonenumber: params.phoneNumber,
    },
  });
}

async function getCategories(http: HttpClient): Promise<KakaoCategoryResponse> {
  return http.post<KakaoCategoryResponse>({
    path: '/akv10/category/',
    fields: {},
  });
}

async function requestProfileAdd(
  http: HttpClient,
  params: KakaoProfileAddParams,
): Promise<KakaoBaseResponse> {
  return http.post<KakaoBaseResponse>({
    path: '/akv10/profile/add/',
    fields: {
      plusid: params.plusId,
      authnum: params.authNum,
      phonenumber: params.phoneNumber,
      categorycode: params.categoryCode,
    },
  });
}

async function listProfiles(
  http: HttpClient,
  params?: KakaoProfileListParams,
): Promise<KakaoProfileListResponse> {
  return http.post<KakaoProfileListResponse>({
    path: '/akv10/profile/list/',
    fields: {
      plusid: params?.plusId,
      senderkey: params?.senderKey,
    },
  });
}

async function listTemplates(
  http: HttpClient,
  params: KakaoTemplateListParams,
): Promise<KakaoTemplateListResponse> {
  return http.post<KakaoTemplateListResponse>({
    path: '/akv10/template/list/',
    fields: {
      senderkey: params.senderKey,
      tpl_code: params.templateCode,
    },
  });
}

async function createTemplate(
  http: HttpClient,
  params: KakaoCreateTemplateParams,
): Promise<KakaoTemplateResponse> {
  const fields: Record<string, string | number | undefined> = {
    senderkey: params.senderKey,
    tpl_name: params.name,
    tpl_content: params.content,
    tpl_secure: params.secure,
    tpl_type: params.type,
    tpl_emtype: params.emType,
    tpl_advert: params.advert,
    tpl_extra: params.extra,
    tpl_title: params.title,
    tpl_stitle: params.subTitle,
  };

  if (params.buttons?.length) {
    fields.tpl_button = JSON.stringify({ button: params.buttons });
  }

  return http.post<KakaoTemplateResponse>({
    path: '/akv10/template/add/',
    fields,
    attachments: { image: params.image },
  });
}

async function updateTemplate(
  http: HttpClient,
  params: KakaoUpdateTemplateParams,
): Promise<KakaoTemplateResponse> {
  const fields: Record<string, string | number | undefined> = {
    senderkey: params.senderKey,
    tpl_code: params.templateCode,
    tpl_name: params.name,
    tpl_content: params.content,
    tpl_secure: params.secure,
    tpl_type: params.type,
    tpl_emtype: params.emType,
    tpl_advert: params.advert,
    tpl_extra: params.extra,
    tpl_title: params.title,
    tpl_stitle: params.subTitle,
  };

  if (params.buttons?.length) {
    fields.tpl_button = JSON.stringify({ button: params.buttons });
  }

  return http.post<KakaoTemplateResponse>({
    path: '/akv10/template/modify/',
    fields,
    attachments: { image: params.image },
  });
}

async function deleteTemplate(
  http: HttpClient,
  params: { senderKey: string; templateCode: string },
): Promise<KakaoBaseResponse> {
  return http.post<KakaoBaseResponse>({
    path: '/akv10/template/del/',
    fields: {
      senderkey: params.senderKey,
      tpl_code: params.templateCode,
    },
  });
}

async function requestTemplateReview(
  http: HttpClient,
  params: { senderKey: string; templateCode: string },
): Promise<KakaoBaseResponse> {
  return http.post<KakaoBaseResponse>({
    path: '/akv10/template/request/',
    fields: {
      senderkey: params.senderKey,
      tpl_code: params.templateCode,
    },
  });
}

async function sendAlimtalk(
  http: HttpClient,
  params: KakaoAlimtalkSendParams,
): Promise<KakaoSendResponse> {
  if (!params.messages.length) {
    throw new AligoError('messages must include at least 1 entry');
  }
  if (params.messages.length > 500) {
    throw new AligoError('messages cannot exceed 500 entries');
  }

  const fields: Record<string, string | number | undefined> = {
    senderkey: params.senderKey,
    tpl_code: params.templateCode,
    sender: params.sender,
    senddate: params.sendDate,
    failover: params.failover,
    testMode: params.testMode,
  };

  params.messages.forEach((message, index) => {
    const idx = index + 1;
    fields[`receiver_${idx}`] = message.receiver;
    fields[`recvname_${idx}`] = message.recvName;
    fields[`subject_${idx}`] = message.subject;
    fields[`message_${idx}`] = message.message;
    fields[`emtitle_${idx}`] = message.emTitle;

    if (message.buttons?.length) {
      fields[`button_${idx}`] = JSON.stringify({ button: message.buttons });
    }

    if (message.failoverSubject) {
      fields[`fsubject_${idx}`] = message.failoverSubject;
    }
    if (message.failoverMessage) {
      fields[`fmessage_${idx}`] = message.failoverMessage;
    }
  });

  return http.post<KakaoSendResponse>({
    path: '/akv10/alimtalk/send/',
    fields,
  });
}

async function sendFriendtalk(
  http: HttpClient,
  params: KakaoFriendtalkSendParams,
): Promise<KakaoSendResponse> {
  if (!params.messages.length) {
    throw new AligoError('messages must include at least 1 entry');
  }
  if (params.messages.length > 500) {
    throw new AligoError('messages cannot exceed 500 entries');
  }

  const fields: Record<string, string | number | undefined> = {
    senderkey: params.senderKey,
    sender: params.sender,
    senddate: params.sendDate,
    advert: params.advert,
    image_url: params.imageUrl,
    wideyn: params.wideImage,
    failover: params.failover,
    testMode: params.testMode,
  };

  params.messages.forEach((message, index) => {
    const idx = index + 1;
    fields[`receiver_${idx}`] = message.receiver;
    fields[`recvname_${idx}`] = message.recvName;
    fields[`subject_${idx}`] = message.subject;
    fields[`message_${idx}`] = message.message;
    if (message.buttons?.length) {
      fields[`button_${idx}`] = JSON.stringify({ button: message.buttons });
    }
    if (message.failoverSubject) {
      fields[`fsubject_${idx}`] = message.failoverSubject;
    }
    if (message.failoverMessage) {
      fields[`fmessage_${idx}`] = message.failoverMessage;
    }
  });

  const attachments = {
    image: params.image,
    fimage: params.failoverImage,
  };

  return http.post<KakaoSendResponse>({
    path: '/akv10/friend/send/',
    fields,
    attachments,
  });
}

async function sendFriendtalkWideList(
  http: HttpClient,
  params: KakaoFriendtalkWideListParams,
): Promise<KakaoSendResponse> {
  if (params.items.length < 3 || params.items.length > 4) {
    throw new AligoError('items must include between 3 and 4 entries for wide list');
  }

  const fields: Record<string, string | number | undefined> = {
    senderkey: params.senderKey,
    sender: params.sender,
    senddate: params.sendDate,
    advert: params.advert,
    image_url: params.imageUrl,
    wideyn: 'Y',
    item_header: params.itemHeader,
    failover: params.failover,
    testMode: params.testMode,
  };

  params.messages.forEach((message, index) => {
    const idx = index + 1;
    fields[`receiver_${idx}`] = message.receiver;
    fields[`recvname_${idx}`] = message.recvName;
    fields[`subject_${idx}`] = message.subject;
    fields[`message_${idx}`] = message.message;
    if (message.buttons?.length) {
      fields[`button_${idx}`] = JSON.stringify({ button: message.buttons });
    }
    if (message.failoverSubject) {
      fields[`fsubject_${idx}`] = message.failoverSubject;
    }
    if (message.failoverMessage) {
      fields[`fmessage_${idx}`] = message.failoverMessage;
    }
  });

  const attachments: Record<string, Attachment | undefined> = {
    image: params.image,
    fimage: params.failoverImage,
  };

  params.items.forEach((item, index) => {
    const idx = index + 1;
    fields[`item_${idx}_title`] = item.title;
    fields[`item_${idx}_description`] = item.description;
    fields[`item_${idx}_url_mobile`] = item.urlMobile;
    fields[`item_${idx}_url_pc`] = item.urlPc;
    fields[`item_${idx}_scheme_and`] = item.schemeAnd;
    fields[`item_${idx}_scheme_ios`] = item.schemeIos;
    attachments[`item_${idx}_image`] = item.image;
  });

  return http.post<KakaoSendResponse>({
    path: '/akv10/friend/send/',
    fields,
    attachments,
  });
}

async function sendFriendtalkCarousel(
  http: HttpClient,
  params: KakaoFriendtalkCarouselParams,
): Promise<KakaoSendResponse> {
  if (params.items.length < 2 || params.items.length > 6) {
    throw new AligoError('items must include between 2 and 6 entries for carousel');
  }

  const fields: Record<string, string | number | undefined> = {
    senderkey: params.senderKey,
    sender: params.sender,
    senddate: params.sendDate,
    advert: params.advert,
    image_url: params.imageUrl,
    wideyn: params.wideImage,
    failover: params.failover,
    testMode: params.testMode,
  };

  params.messages.forEach((message, index) => {
    const idx = index + 1;
    fields[`receiver_${idx}`] = message.receiver;
    fields[`recvname_${idx}`] = message.recvName;
    fields[`subject_${idx}`] = message.subject;
    fields[`message_${idx}`] = message.message;
    if (message.buttons?.length) {
      fields[`button_${idx}`] = JSON.stringify({ button: message.buttons });
    }
    if (message.failoverSubject) {
      fields[`fsubject_${idx}`] = message.failoverSubject;
    }
    if (message.failoverMessage) {
      fields[`fmessage_${idx}`] = message.failoverMessage;
    }
  });

  const attachments: Record<string, Attachment | undefined> = {
    image: params.image,
    fimage: params.failoverImage,
  };

  params.items.forEach((item, index) => {
    const idx = index + 1;
    fields[`carousel_${idx}_header`] = item.header;
    fields[`carousel_${idx}_message`] = item.message;
    if (item.buttons?.length) {
      fields[`carousel_${idx}_button`] = JSON.stringify(item.buttons);
    }
    attachments[`carousel_${idx}_image`] = item.image;
  });

  return http.post<KakaoSendResponse>({
    path: '/akv10/friend/send/',
    fields,
    attachments,
  });
}

async function listHistory(
  http: HttpClient,
  params?: KakaoHistoryListParams,
): Promise<KakaoHistoryListResponse> {
  return http.post<KakaoHistoryListResponse>({
    path: '/akv10/history/list/',
    fields: {
      page: params?.page,
      limit: params?.limit,
      startdate: params?.startDate,
      enddate: params?.endDate,
    },
  });
}

async function detailHistory(
  http: HttpClient,
  params: KakaoHistoryDetailParams,
): Promise<KakaoHistoryDetailResponse> {
  return http.post<KakaoHistoryDetailResponse>({
    path: '/akv10/history/detail/',
    fields: {
      mid: params.mid,
      page: params.page,
      limit: params.limit,
    },
  });
}

async function getRemain(http: HttpClient) {
  return http.post<KakaoRemainResponse>({
    path: '/akv10/heartinfo/',
    fields: {},
  });
}

async function cancel(http: HttpClient, params: CancelParams) {
  return http.post<KakaoBaseResponse>({
    path: '/akv10/cancel/',
    fields: {
      mid: params.mid,
    },
  });
}
