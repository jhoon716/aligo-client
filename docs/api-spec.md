# aligo-client 상세 API 스펙

## 공통 규칙

- 메서드: 모든 엔드포인트 `POST`
- 기본 Base URL
  - SMS: `https://apis.aligo.in`
  - Kakao: `https://kakaoapi.aligo.in`
- 인증 필드
  - SMS: `key`, `user_id`
  - Kakao: `apikey`, `userid`, `token`(토큰 발급 제외 모든 호출에 필요)
- 요청 인코딩
  - 첨부 없음: `application/x-www-form-urlencoded`
  - 첨부 있음: `multipart/form-data`
- 에러 처리
  - HTTP 실패 또는 `result_code < 0` / `code < 0`이면 `AligoError` throw

---

# SMS API

## 1) 문자 발송

- SDK: `client.sms.send()`
- Path: `/send/`
- 필수: `sender`, `receiver`, `msg`

### 파라미터 매핑

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| sender | sender | 발신자 번호(최대 16bytes) | O |
| receiver | receiver | 콤마(,)로 최대 1000명 | O |
| msg | msg | 메시지 내용(1~2,000Byte) | O |
| msgType | msg_type | SMS/LMS/MMS | X |
| title | title | 문자 제목(LMS/MMS) | X |
| destination | destination | %고객명% 치환용 | X |
| rdate | rdate | 예약일(YYYYMMDD) | X |
| rtime | rtime | 예약시간(HHII) | X |
| testmodeYn | testmode_yn | 테스트 모드(Y) | X |
| image1~3 | image1~3 | 첨부 이미지 | X |

### 응답(요약)

`result_code`, `message`, `msg_id`, `success_cnt`, `error_cnt`, `msg_type`

---

## 2) 문자 대량 발송

- SDK: `client.sms.sendMass()`
- Path: `/send_mass/`
- 필수: `sender`, `msgType`, `messages`(1~500)
- SDK 제약: `messages.length`는 1~500, 초과 시 `AligoError`

### 파라미터 매핑

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| sender | sender | 발신자 번호 | O |
| msgType | msg_type | SMS/LMS/MMS | O |
| messages[n].receiver | rec_{n} | 수신자 | O |
| messages[n].msg | msg_{n} | 메시지 내용 | O |
| (자동) | cnt | 메시지 전송건수 | O |
| title | title | 문자 제목 | X |
| rdate | rdate | 예약일 | X |
| rtime | rtime | 예약시간 | X |
| testmodeYn | testmode_yn | 테스트 모드 | X |
| image1~3 | image1~3 | 첨부 이미지 | X |

### 응답(요약)

`result_code`, `message`, `msg_id`, `success_cnt`, `error_cnt`, `msg_type`

---

## 3) 전송내역 조회

- SDK: `client.sms.list()`
- Path: `/list/`

### 파라미터 매핑

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| page | page | 페이지 번호 | X |
| pageSize | page_size | 페이지당 출력(기본 30) | X |
| startDate | start_date | 조회 시작일(YYYYMMDD) | X |
| limitDay | limit_day | 조회 마감일자 | X |

---

## 4) 전송결과 상세

- SDK: `client.sms.getDetails()`
- Path: `/sms_list/`

### 파라미터 매핑

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| mid | mid | 메시지 고유 ID | O |
| page | page | 페이지 번호 | X |
| pageSize | page_size | 페이지당 출력 | X |

---

## 5) 발송 가능 건수

- SDK: `client.status.getRemain()`
- Path: `/remain/`

---

## 6) 예약 취소

- SDK: `client.sms.cancel()`
- Path: `/cancel/`
- 필수: `mid`

---

# Kakao API

## 공통

- SDK: `client.kakao.*`
- 모든 Kakao 호출은 `kakaoToken`이 필요 (토큰 발급 제외)

---

## 1) 토큰 발급

- SDK: `client.kakao.token.create()`
- Path: `/akv10/token/create/{time}/{type}`
- 필수: `time`(숫자), `type`(`y|m|d|h|i|s`)
- 토큰 발급 요청에는 `token`이 포함되지 않습니다.

---

## 2) 카카오채널 인증 요청

- SDK: `client.kakao.profile.requestAuth()`
- Path: `/akv10/profile/auth/`

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| plusId | plusid | 카카오채널 아이디(@ 포함) | O |
| phoneNumber | phonenumber | 관리자 휴대폰 번호 | O |

---

## 3) 카테고리 조회

- SDK: `client.kakao.profile.getCategories()`
- Path: `/akv10/category/`

---

## 4) 친구등록 심사 요청

- SDK: `client.kakao.profile.requestAdd()`
- Path: `/akv10/profile/add/`

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| plusId | plusid | 카카오채널 아이디(@ 포함) | O |
| authNum | authnum | 인증번호 | O |
| phoneNumber | phonenumber | 관리자 휴대폰 번호 | O |
| categoryCode | categorycode | 카테고리 코드 | O |

---

## 5) 등록된 카카오채널 리스트

- SDK: `client.kakao.profile.list()`
- Path: `/akv10/profile/list/`

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| plusId | plusid | 카카오채널 아이디 | X |
| senderKey | senderkey | 발신프로필 키 | X |

---

## 6) 템플릿 리스트

- SDK: `client.kakao.templates.list()`
- Path: `/akv10/template/list/`

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| senderKey | senderkey | 발신프로필 키 | O |
| templateCode | tpl_code | 템플릿 코드 | X |

---

## 7) 템플릿 등록

- SDK: `client.kakao.templates.create()`
- Path: `/akv10/template/add/`

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| senderKey | senderkey | 발신프로필 키 | O |
| name | tpl_name | 템플릿 이름 | O |
| content | tpl_content | 템플릿 내용 | O |
| secure | tpl_secure | 보안 템플릿 여부 | X |
| type | tpl_type | 템플릿 유형 | X |
| emType | tpl_emtype | 강조 유형 | X |
| advert | tpl_advert | 광고 문구(AD 템플릿 필수) | X |
| extra | tpl_extra | 부가정보 | X |
| title | tpl_title | 강조 제목 | X |
| subTitle | tpl_stitle | 강조 부제 | X |
| buttons | tpl_button | 버튼 JSON | X |
| image | image | 템플릿 이미지 | X |

---

## 8) 템플릿 수정

- SDK: `client.kakao.templates.update()`
- Path: `/akv10/template/modify/`

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| senderKey | senderkey | 발신프로필 키 | O |
| templateCode | tpl_code | 템플릿 코드 | O |
| name | tpl_name | 템플릿 이름 | O |
| content | tpl_content | 템플릿 내용 | O |
| secure | tpl_secure | 보안 템플릿 여부 | X |
| type | tpl_type | 템플릿 유형 | X |
| emType | tpl_emtype | 강조 유형 | X |
| advert | tpl_advert | 광고 문구(AD 템플릿 필수) | X |
| extra | tpl_extra | 부가정보 | X |
| title | tpl_title | 강조 제목 | X |
| subTitle | tpl_stitle | 강조 부제 | X |
| buttons | tpl_button | 버튼 JSON | X |
| image | image | 템플릿 이미지 | X |

---

## 9) 템플릿 삭제

- SDK: `client.kakao.templates.delete()`
- Path: `/akv10/template/del/`
- 필수: `senderKey`, `templateCode`

---

## 10) 템플릿 검수 요청

- SDK: `client.kakao.templates.requestReview()`
- Path: `/akv10/template/request/`
- 필수: `senderKey`, `templateCode`

---

## 11) 알림톡 전송

- SDK: `client.kakao.sendAlimtalk()`
- Path: `/akv10/alimtalk/send/`
- SDK 제약: `messages` 1~500

### 상위 필드

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| senderKey | senderkey | 발신프로필 키 | O |
| templateCode | tpl_code | 템플릿 코드 | O |
| sender | sender | 발신자 연락처 | O |
| sendDate | senddate | 예약일(YYYYMMDDHHmmss) | X |
| failover | failover | 실패 시 대체문자 | X |
| testMode | testMode | 테스트 모드 | X |

### messages 항목

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| receiver | receiver_n | 수신자 연락처 | O |
| recvName | recvname_n | 수신자 이름 | X |
| subject | subject_n | 알림톡 제목 | O |
| message | message_n | 알림톡 내용 | O |
| emTitle | emtitle_n | 강조표기형 타이틀 | X |
| buttons | button_n | 버튼 JSON | X |
| failoverSubject | fsubject_n | 대체문자 제목 | X |
| failoverMessage | fmessage_n | 대체문자 내용 | X |

---

## 12) 친구톡 전송

- SDK: `client.kakao.sendFriendtalk()`
- Path: `/akv10/friend/send/`
- SDK 제약: `messages` 1~500

### 상위 필드

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| senderKey | senderkey | 발신프로필 키 | O |
| sender | sender | 발신자 연락처 | O |
| sendDate | senddate | 예약일 | X |
| advert | advert | 광고표시(Y/N) | X |
| imageUrl | image_url | 이미지 클릭 링크 | X |
| wideImage | wideyn | 와이드 이미지 여부 | X |
| failover | failover | 실패 시 대체문자 | X |
| testMode | testMode | 테스트 모드 | X |
| image | image | 첨부 이미지 | X |
| failoverImage | fimage | 대체문자 이미지 | X |

### messages 항목

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| receiver | receiver_n | 수신자 연락처 | O |
| recvName | recvname_n | 수신자 이름 | X |
| subject | subject_n | 친구톡 제목 | O |
| message | message_n | 친구톡 내용 | O |
| buttons | button_n | 버튼 JSON | X |
| failoverSubject | fsubject_n | 대체문자 제목 | X |
| failoverMessage | fmessage_n | 대체문자 내용 | X |

---

## 13) 친구톡 와이드 아이템 리스트

- SDK: `client.kakao.sendFriendtalkWideList()`
- Path: `/akv10/friend/send/`
- SDK 제약: `items` 3~4

### items 항목

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| title | item_{n}_title | 아이템 제목 | O |
| description | item_{n}_description | 아이템 설명 | O |
| urlMobile | item_{n}_url_mobile | 모바일 링크 | O |
| urlPc | item_{n}_url_pc | PC 링크 | X |
| schemeAnd | item_{n}_scheme_and | Android 스킴 | X |
| schemeIos | item_{n}_scheme_ios | iOS 스킴 | X |
| image | item_{n}_image | 아이템 이미지 | O |

---

## 14) 친구톡 캐러셀 메시지

- SDK: `client.kakao.sendFriendtalkCarousel()`
- Path: `/akv10/friend/send/`
- SDK 제약: `items` 2~6

### items 항목

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| header | carousel_{n}_header | 캐러셀 제목 | O |
| message | carousel_{n}_message | 캐러셀 메시지 | O |
| buttons | carousel_{n}_button | 캐러셀 버튼(JSON) | X |
| image | carousel_{n}_image | 캐러셀 이미지 | O |

---

## 15) 전송내역 조회

- SDK: `client.kakao.history.list()`
- Path: `/akv10/history/list/`

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| page | page | 페이지 번호 | X |
| limit | limit | 페이지당 출력 | X |
| startDate | startdate | 조회 시작일 | X |
| endDate | enddate | 조회 마감일 | X |

---

## 16) 전송결과 상세

- SDK: `client.kakao.history.detail()`
- Path: `/akv10/history/detail/`

| SDK 필드 | API 필드 | 설명 | 필수 |
| --- | --- | --- | --- |
| mid | mid | 메시지 고유 ID | O |
| page | page | 페이지 번호 | X |
| limit | limit | 페이지당 출력 | X |

---

## 17) 발송 가능 건수

- SDK: `client.kakao.remain()`
- Path: `/akv10/heartinfo/`

---

## 18) 예약 취소

- SDK: `client.kakao.cancel()`
- Path: `/akv10/cancel/`
- 필수: `mid`
