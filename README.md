# aligo-client

Node 22+ 전용 ESM TypeScript SDK로, 알리고 SMS/LMS/MMS 및 카카오 알림톡/친구톡 REST API를 래핑합니다.

공식 스펙: `https://smartsms.aligo.in/admin/api/spec.html`, `https://smartsms.aligo.in/shop/kakaoapispec.html`.

## 특징

- ESM only, Node 22+.
- 의존성 최소: 런타임 deps 0, `fetch` 내장 사용.
- `AligoError` 예외 기반 오류 처리(HTTP/결과 코드 포함).
- 자동 폼 직렬화: 파일이 있으면 multipart, 아니면 x-www-form-urlencoded.
- Kakao/SMS 모두 동일한 클라이언트로 생성.

## 설치

```bash
npm install aligo-client
```

## 빠른 시작 (SMS)

```ts
import { createAligoClient } from 'aligo-client';

const client = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
});

const result = await client.sms.send({
  sender: '01000000000',
  receiver: '01011112222,01033334444',
  msg: 'aligo-client: 기본 전송 예제',
  testmodeYn: 'Y', // 과금 방지
});

console.log(result);
```

## 제공 API (요약)

- SMS: `send`, `sendMass`, `list`, `getDetails`, `cancel`, `status.getRemain`
- Kakao 프로필: `kakao.profile.requestAuth`, `getCategories`, `requestAdd`, `list`
- Kakao 토큰: `kakao.token.create` (from `aligoapi` npm package)
- Kakao 템플릿: `kakao.templates.list/create/update/delete/requestReview`
- 알림톡: `kakao.sendAlimtalk`
- 친구톡: `kakao.sendFriendtalk`, `sendFriendtalkWideList`, `sendFriendtalkCarousel`
- 이력/잔여/취소: `kakao.history.list/detail`, `kakao.remain`, `kakao.cancel`

## 설정 팁

- `timeoutMs`: 기본 30초, 알리고 응답이 느리면 늘려주세요.
- `retry`: `{ retries, factor, minTimeoutMs }`로 네트워크/5xx만 재시도. 기본 비활성화.
- `baseUrl`/`kakaoBaseUrl`: 커스텀 프록시나 스테이징 시 오버라이드.
- 환경 변수 사용 예: `ALIGO_KEY`, `ALIGO_USER_ID`, `ALIGO_SENDER_KEY`, `ALIGO_TEMPLATE_CODE`.

## 첨부/파일

MMS(`sms.send/sendMass`)의 `image1~3`, 친구톡 첨부/와이드/캐러셀 이미지와 템플릿 이미지 모두 `Attachment` 형태 `{ data, filename?, contentType? }`를 받습니다. `data`는 `Blob | File | Buffer | ArrayBuffer | ArrayBufferView` 지원. 첨부가 있으면 자동으로 `multipart/form-data` 전송.

## 잔여/취소 예시

```ts
const remain = await client.status.getRemain();
const cancel = await client.sms.cancel({ mid: 123456789 }); // 발송 5분 전까지만 가능
```

## 카카오 알림톡/친구톡 예시

```ts
await client.kakao.sendAlimtalk({
  senderKey: 'SENDER_KEY',
  templateCode: 'TPL_CODE',
  sender: '01000000000',
  messages: [
    {
      receiver: '01011112222',
      subject: '알림톡 제목',
      message: '알림톡 내용',
      buttons: [
        {
          name: '웹링크',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://example.com',
        },
      ],
      failoverSubject: '대체문자 제목',
      failoverMessage: '대체문자 내용',
    },
  ],
  failover: 'Y',
  testMode: 'Y',
});
```

```ts
await client.kakao.sendFriendtalk({
  senderKey: 'SENDER_KEY',
  sender: '01000000000',
  advert: 'Y',
  messages: [{ receiver: '01011112222', subject: '친구톡 제목', message: '친구톡 내용' }],
  imageUrl: 'https://smartsms.aligo.in',
  testMode: 'Y',
});
```

## 에러 처리

- HTTP 오류/타임아웃 또는 API `result_code < 0`/`code < 0` 시 `AligoError` throw.
- 에러 객체에는 `resultCode`/`status`/`endpoint`가 담기며, 키는 마스킹.

## 설정 옵션

- `baseUrl` 기본 `https://apis.aligo.in`, `kakaoBaseUrl` 기본 `https://kakaoapi.aligo.in`
- `timeoutMs` 기본 30000
- `retry` 기본 비활성화(네트워크/5xx만, `{ retries, factor, minTimeoutMs }`)

## 예제 & 테스트

- 예제: `examples/send-basic.mjs`, `send-mass.mjs`, `check-history.mjs`, `remain-and-cancel.mjs`, `send-alimtalk.mjs`, `send-friendtalk.mjs`
- TS 예제: `examples-ts/send-basic.ts`, `examples-ts/send-alimtalk.ts` (로컬 실행용 `../src/index.js` import)
- 빌드 후 실행: `npm run build`
- 테스트: `npm test` (node:test, fetch 모킹)

---

## English Overview

Node 22+ ESM-only TypeScript SDK for Aligo SMS/LMS/MMS and Kakao Alimtalk/Friendtalk APIs. Specs: `https://smartsms.aligo.in/admin/api/spec.html`, `https://smartsms.aligo.in/shop/kakaoapispec.html`.

### Install

```bash
npm install aligo-client
```

### Quick start

```ts
import { createAligoClient } from 'aligo-client';

const client = createAligoClient({
  key: process.env.ALIGO_KEY!,
  userId: process.env.ALIGO_USER_ID!,
});
await client.sms.send({
  sender: '01000000000',
  receiver: '01011112222',
  msg: 'hello',
  testmodeYn: 'Y',
});
```

### API surface

- SMS: `send`, `sendMass`, `list`, `getDetails`, `cancel`, `status.getRemain`
- Kakao profile/category: `kakao.profile.requestAuth/getCategories/requestAdd/list`
- Kakao templates: `kakao.templates.list/create/update/delete/requestReview`
- Alimtalk: `kakao.sendAlimtalk`
- Friendtalk: `kakao.sendFriendtalk`, `sendFriendtalkWideList`, `sendFriendtalkCarousel`
- History/remain/cancel: `kakao.history.list/detail`, `kakao.remain`, `kakao.cancel`

### Attachments

Any attachment field accepts `{ data, filename?, contentType? }` where `data` is `Blob | File | Buffer | ArrayBuffer | ArrayBufferView`. Multipart is selected automatically when attachments exist.

### Errors

`AligoError` is thrown on HTTP failures or negative result codes. It carries `resultCode/status/endpoint` and masks secrets.

### Configuration

- `baseUrl` default `https://apis.aligo.in`; `kakaoBaseUrl` default `https://kakaoapi.aligo.in`
- `timeoutMs` default 30000
- `retry` optional (`retries`, `factor`, `minTimeoutMs`) for network/5xx only

### Notes

- Uses `AligoError` throws (HTTP + API code awareness) and masks secrets in messages.
- Environment variables you might set: `ALIGO_KEY`, `ALIGO_USER_ID`, `ALIGO_SENDER_KEY`, `ALIGO_TEMPLATE_CODE`.

### Examples

See `examples/` (basic send, mass, history, remain/cancel, alimtalk, friendtalk). Build first: `npm run build`.
TypeScript examples live in `examples-ts/` (importing from `../src/index.js` for local runs).

### Testing

```bash
npm test
```

Uses `node:test` with mocked `fetch` to verify serialization and error handling.

## License

Licensed under the MIT License. See `LICENSE` for details.
