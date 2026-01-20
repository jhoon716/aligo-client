import { createAligoClient } from '../src/index.js';

const client = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
  kakaoToken: process.env.ALIGO_KAKAO_TOKEN ?? 'YOUR_KAKAO_TOKEN',
  // token 발급: kakao.token.create({ time: 30, type: 'h' })
});

async function main() {
  try {
    const result = await client.kakao.sendAlimtalk({
      senderKey: process.env.ALIGO_SENDER_KEY ?? 'YOUR_SENDER_KEY',
      templateCode: process.env.ALIGO_TEMPLATE_CODE ?? 'TPL_CODE',
      sender: '01000000000',
      testMode: 'Y',
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
        },
      ],
    });

    console.log('Alimtalk result:', result);
  } catch (error) {
    console.error('Alimtalk failed', error);
  }
}

await main();
