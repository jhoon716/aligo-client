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

## 제공 API

API 문서: `docs/api-spec.md`

## 빠른 시작

### 공통

```ts
import { createAligoClient } from 'aligo-client';

const client = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
});
```

### SMS

```ts
await client.sms.send({
  sender: '01000000000',
  receiver: '01011112222,01033334444',
  msg: 'aligo-client: 기본 전송 예제',
  testmodeYn: 'Y',
});
```

### 카카오톡 (토큰 발급/사용)

카카오 API는 토큰이 있어야 호출할 수 있습니다. 먼저 토큰을 발급한 뒤, 그 토큰을 클라이언트에 주입해 사용합니다.
`type`은 시간 단위 코드 `y/m/d/h/i/s`, `time`은 유효시간 값(숫자)입니다.

1) 토큰 발급

```ts
const tokenResponse = await client.kakao.token.create({
  time: 30,
  type: 'h',
});
```

2) 토큰 추출

토큰은 `response.token` 형태로 추출해 사용합니다.

```ts
const tokenValue = tokenResponse.token;
```

3) 토큰 주입 후 카카오 호출

```ts
const kakaoClient = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
  kakaoToken: tokenValue,
});

await kakaoClient.kakao.sendAlimtalk({
  senderKey: 'SENDER_KEY',
  templateCode: 'TPL_CODE',
  sender: '01000000000',
  messages: [
    {
      receiver: '01011112222',
      subject: '알림톡 제목',
      message: '알림톡 내용',
    },
  ],
  testMode: 'Y',
});
```

토큰 발급 외의 카카오 호출은 `kakaoToken`이 필요합니다. 토큰이 갱신되면 새 클라이언트를 생성해 교체하세요.

## 첨부/파일

- MMS
  - `sms.send`/`sms.sendMass`: `image1~3`
- 카카오톡
  - 친구톡 이미지: `image`, `fimage`
  - 와이드/캐러셀 이미지: `item_*_image`, `carousel_*_image`
  - 템플릿 이미지: `image`

모든 첨부는 `Attachment` 형태 `{ data, filename?, contentType? }`를 받습니다. `data`는 `Blob | File | Buffer | ArrayBuffer | ArrayBufferView` 지원. 첨부가 있으면 자동으로 `multipart/form-data` 전송.

## 설정

- `baseUrl` 기본 `https://apis.aligo.in`, `kakaoBaseUrl` 기본 `https://kakaoapi.aligo.in`
- `timeoutMs` 기본 30000
- `retry` 기본 비활성화(네트워크/5xx만, `{ retries, factor, minTimeoutMs }`)

## 에러 처리

- HTTP 오류/타임아웃 또는 API `result_code < 0`/`code < 0` 시 `AligoError` throw.
- 에러 객체에는 `resultCode`/`status`/`endpoint`가 담기며, 키는 마스킹.

## 예제

- 예제: `examples/send-basic.mjs`, `send-mass.mjs`, `check-history.mjs`, `remain-and-cancel.mjs`, `send-alimtalk.mjs`, `send-friendtalk.mjs`
- TS 예제: `examples-ts/send-basic.ts`, `examples-ts/send-alimtalk.ts` (로컬 실행용 `../src/index.js` import)
- 빌드 후 실행: `npm run build`

## 테스트

- `npm test` (node:test, fetch 모킹)

## License

Licensed under the MIT License. See `LICENSE` for details.
