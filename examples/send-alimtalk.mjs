import { createAligoClient } from '../dist/index.js';

const client = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
});

async function main() {
  try {
    const result = await client.kakao.sendAlimtalk({
      senderKey: process.env.ALIGO_SENDER_KEY ?? 'YOUR_SENDER_KEY',
      templateCode: process.env.ALIGO_TEMPLATE_CODE ?? 'TPL_CODE',
      sender: '01000000000',
      sendDate: undefined, // or 'YYYYMMDDHHmmss' for reservation
      failover: 'Y',
      testMode: 'Y',
      messages: [
        {
          receiver: '01011112222',
          recvName: '홍길동',
          subject: '알림톡 제목',
          message: '알리고 알림톡 테스트 메시지입니다.',
          buttons: [
            {
              name: '웹링크',
              linkType: 'WL',
              linkTypeName: '웹링크',
              linkMo: 'https://example.com',
            },
          ],
          failoverSubject: '대체문자 제목',
          failoverMessage: '대체문자 내용입니다.',
        },
      ],
    });

    console.log('Alimtalk result:', result);
  } catch (error) {
    console.error('Alimtalk send failed', error);
  }
}

await main();
