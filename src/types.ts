export interface RetryOptions {
  retries?: number;
  factor?: number;
  minTimeoutMs?: number;
}

export interface AligoClientOptions {
  key: string;
  userId: string;
  baseUrl?: string;
  kakaoBaseUrl?: string;
  timeoutMs?: number;
  retry?: RetryOptions;
}

export type AttachmentData = Blob | File | Buffer | ArrayBuffer | ArrayBufferView;

export interface Attachment {
  data: AttachmentData;
  filename?: string;
  contentType?: string;
}

export interface SendMessageParams {
  sender: string;
  receiver: string; // comma-separated up to 1,000 numbers per spec
  msg: string;
  msgType?: 'SMS' | 'LMS' | 'MMS';
  title?: string;
  destination?: string;
  rdate?: string;
  rtime?: string;
  image1?: Attachment;
  image2?: Attachment;
  image3?: Attachment;
  testmodeYn?: 'Y';
}

export interface SendMassMessage {
  receiver: string;
  msg: string;
}

export interface SendMassParams {
  sender: string;
  msgType: 'SMS' | 'LMS' | 'MMS';
  messages: SendMassMessage[]; // 1~500 entries
  title?: string;
  rdate?: string;
  rtime?: string;
  image1?: Attachment;
  image2?: Attachment;
  image3?: Attachment;
  testmodeYn?: 'Y';
}

export interface ListMessagesParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  limitDay?: number;
}

export interface SmsListParams {
  mid: number;
  page?: number;
  pageSize?: number;
}

export interface CancelParams {
  mid: number;
}

export interface ApiBaseResponse {
  result_code: number;
  message: string;
}

export interface SendResponse extends ApiBaseResponse {
  msg_id?: number;
  success_cnt?: number;
  error_cnt?: number;
  msg_type?: string;
}

export interface ListItem {
  mid: number | string;
  type: string;
  sender: string;
  sms_count: number | string;
  reserve_state: string;
  msg: string;
  fail_count: number | string;
  reg_date: string;
  reserve: string;
}

export interface ListResponse extends ApiBaseResponse {
  list?: ListItem[];
  next_yn?: string;
}

export interface SmsListItem {
  mdid: number | string;
  type: string;
  sender: string;
  receiver: string;
  sms_state: string;
  reg_date: string;
  send_date: string;
  reserve_date: string;
}

export interface SmsListResponse extends ApiBaseResponse {
  list?: SmsListItem[];
  next_yn?: string;
}

export interface RemainResponse extends ApiBaseResponse {
  SMS_CNT?: number;
  LMS_CNT?: number;
  MMS_CNT?: number;
}

export interface CancelResponse extends ApiBaseResponse {
  cancel_date?: string;
}

export interface SmsNamespace {
  send(params: SendMessageParams): Promise<SendResponse>;
  sendMass(params: SendMassParams): Promise<SendResponse>;
  list(params?: ListMessagesParams): Promise<ListResponse>;
  getDetails(params: SmsListParams): Promise<SmsListResponse>;
  cancel(params: CancelParams): Promise<CancelResponse>;
}

export interface StatusNamespace {
  getRemain(): Promise<RemainResponse>;
}

export interface KakaoBaseResponse {
  code: number;
  message: string;
}

export interface KakaoButton {
  name: string;
  linkType?: string;
  linkTypeName?: string;
  linkMo?: string;
  linkPc?: string;
  linkIos?: string;
  linkAnd?: string;
}

export interface KakaoProfileAuthParams {
  plusId: string;
  phoneNumber: string;
}

export interface KakaoCategoryResponse extends KakaoBaseResponse {
  data?: Record<string, unknown>;
}

export interface KakaoProfileAddParams {
  plusId: string;
  authNum: string;
  phoneNumber: string;
  categoryCode: string;
}

export interface KakaoProfileListParams {
  plusId?: string;
  senderKey?: string;
}

export interface KakaoProfileSummary {
  senderKey: string;
  uuid?: string;
  name?: string;
  status?: string;
  profileStat?: string;
  cdate?: string;
  udate?: string;
  catCode?: string;
  alimUseYn?: boolean;
  license?: string;
  licenseNum?: string;
}

export interface KakaoProfileListResponse extends KakaoBaseResponse {
  list?: KakaoProfileSummary[];
}

export interface KakaoTemplateButton {
  ordering?: string | number;
  name: string;
  linkType?: string;
  linkTypeName?: string;
  linkMo?: string;
  linkPc?: string;
  linkIos?: string;
  linkAnd?: string;
}

export interface KakaoTemplateInfo {
  senderKey: string;
  templtCode: string;
  templtContent?: string;
  templtName?: string;
  status?: string;
  inspStatus?: string;
  cdate?: string;
  udate?: string;
  templateType?: string;
  templateEmType?: string;
  templtTitle?: string;
  templtSubtitle?: string;
  templtImageName?: string;
  templtImageUrl?: string;
  comments?: unknown;
  buttons?: KakaoTemplateButton[];
}

export interface KakaoTemplateListParams {
  senderKey: string;
  templateCode?: string;
}

export interface KakaoTemplateListResponse extends KakaoBaseResponse {
  list?: KakaoTemplateInfo[];
  info?: Record<string, number>;
}

export interface KakaoCreateTemplateParams {
  senderKey: string;
  name: string;
  content: string;
  secure?: 'Y' | 'N';
  type?: 'BA' | 'EX' | 'AD' | 'MI';
  emType?: 'NONE' | 'TEXT' | 'IMAGE';
  advert?: string;
  extra?: string;
  title?: string;
  subTitle?: string;
  buttons?: KakaoTemplateButton[];
  image?: Attachment;
}

export interface KakaoUpdateTemplateParams extends KakaoCreateTemplateParams {
  templateCode: string;
}

export interface KakaoTemplateResponse extends KakaoBaseResponse {
  data?: KakaoTemplateInfo;
}

export interface KakaoDeleteTemplateParams {
  senderKey: string;
  templateCode: string;
}

export interface KakaoReviewTemplateParams {
  senderKey: string;
  templateCode: string;
}

export interface KakaoAlimtalkMessage {
  receiver: string;
  recvName?: string;
  subject: string;
  message: string;
  emTitle?: string;
  buttons?: KakaoButton[];
  failoverSubject?: string;
  failoverMessage?: string;
}

export interface KakaoAlimtalkSendParams {
  senderKey: string;
  templateCode: string;
  sender: string;
  sendDate?: string;
  messages: KakaoAlimtalkMessage[];
  failover?: 'Y' | 'N';
  testMode?: 'Y' | 'N';
}

export interface KakaoFriendtalkMessage {
  receiver: string;
  recvName?: string;
  subject: string;
  message: string;
  buttons?: KakaoButton[];
  failoverSubject?: string;
  failoverMessage?: string;
}

export interface KakaoFriendtalkSendParams {
  senderKey: string;
  sender: string;
  sendDate?: string;
  advert?: 'Y' | 'N';
  image?: Attachment;
  imageUrl?: string;
  wideImage?: 'Y' | 'N';
  messages: KakaoFriendtalkMessage[];
  failover?: 'Y' | 'N';
  failoverImage?: Attachment;
  testMode?: 'Y' | 'N';
}

export interface KakaoFriendtalkWideItem {
  title: string;
  description: string;
  urlMobile: string;
  urlPc?: string;
  schemeAnd?: string;
  schemeIos?: string;
  image?: Attachment;
}

export interface KakaoFriendtalkWideListParams extends KakaoFriendtalkSendParams {
  itemHeader: string;
  items: KakaoFriendtalkWideItem[];
}

export interface KakaoCarouselButton {
  name: string;
  type: string;
  urlMobile?: string;
  urlPc?: string;
  schemeIos?: string;
  schemeAndroid?: string;
}

export interface KakaoCarouselItem {
  header: string;
  message: string;
  image: Attachment;
  buttons?: KakaoCarouselButton[];
}

export interface KakaoFriendtalkCarouselParams extends KakaoFriendtalkSendParams {
  items: KakaoCarouselItem[];
}

export interface KakaoSendInfo {
  type?: string;
  mid?: number | string;
  current?: number;
  unit?: number;
  total?: number;
  scnt?: number;
  fcnt?: number;
}

export interface KakaoSendResponse extends KakaoBaseResponse {
  info?: KakaoSendInfo;
}

export interface KakaoHistoryListParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface KakaoHistoryListItem {
  mid: number | string;
  type: string;
  sender: string;
  msg_count?: number | string;
  reserve_date?: string;
  reserve_state?: string;
  mbody?: string;
  reg_date?: string;
}

export interface KakaoHistoryListResponse extends KakaoBaseResponse {
  list?: KakaoHistoryListItem[];
  currentPage?: number;
  totalPage?: number;
  totalCount?: number;
}

export interface KakaoHistoryDetailParams {
  mid: number;
  page?: number;
  limit?: number;
}

export interface KakaoHistoryDetailItem {
  msgid: string;
  type: string;
  sender: string;
  phone: string;
  status: number | string;
  reqdate?: string;
  sentdate?: string;
  rsltdate?: string;
  reportdate?: string;
  rslt?: string;
  rslt_message?: string;
  message?: string;
  button_json?: string;
  tpl_code?: string;
  senderKey?: string;
  smid?: number;
}

export interface KakaoHistoryDetailResponse extends KakaoBaseResponse {
  list?: KakaoHistoryDetailItem[];
  currentPage?: number;
  totalPage?: number;
  totalCount?: number;
}

export interface KakaoRemainResponse extends KakaoBaseResponse {
  list?: {
    SMS_CNT?: number;
    LMS_CNT?: number;
    MMS_CNT?: number;
    ALT_CNT?: number;
  };
}

export interface KakaoNamespace {
  profile: {
    requestAuth(params: KakaoProfileAuthParams): Promise<KakaoBaseResponse>;
    requestAdd(params: KakaoProfileAddParams): Promise<KakaoBaseResponse>;
    getCategories(): Promise<KakaoCategoryResponse>;
    list(params?: KakaoProfileListParams): Promise<KakaoProfileListResponse>;
  };
  templates: {
    list(params: KakaoTemplateListParams): Promise<KakaoTemplateListResponse>;
    create(params: KakaoCreateTemplateParams): Promise<KakaoTemplateResponse>;
    update(params: KakaoUpdateTemplateParams): Promise<KakaoTemplateResponse>;
    delete(params: KakaoDeleteTemplateParams): Promise<KakaoBaseResponse>;
    requestReview(params: KakaoReviewTemplateParams): Promise<KakaoBaseResponse>;
  };
  sendAlimtalk(params: KakaoAlimtalkSendParams): Promise<KakaoSendResponse>;
  sendFriendtalk(params: KakaoFriendtalkSendParams): Promise<KakaoSendResponse>;
  sendFriendtalkWideList(params: KakaoFriendtalkWideListParams): Promise<KakaoSendResponse>;
  sendFriendtalkCarousel(params: KakaoFriendtalkCarouselParams): Promise<KakaoSendResponse>;
  history: {
    list(params?: KakaoHistoryListParams): Promise<KakaoHistoryListResponse>;
    detail(params: KakaoHistoryDetailParams): Promise<KakaoHistoryDetailResponse>;
  };
  remain(): Promise<KakaoRemainResponse>;
  cancel(params: CancelParams): Promise<KakaoBaseResponse>;
}

export interface AligoClient {
  sms: SmsNamespace;
  status: StatusNamespace;
  kakao: KakaoNamespace;
}
