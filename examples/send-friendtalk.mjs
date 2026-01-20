import { createAligoClient } from '../dist/index.js';

const client = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
  kakaoToken: process.env.ALIGO_KAKAO_TOKEN ?? 'YOUR_KAKAO_TOKEN',
});

async function main() {
  try {
    const result = await client.kakao.sendFriendtalk({
      senderKey: process.env.ALIGO_SENDER_KEY ?? 'YOUR_SENDER_KEY',
      sender: '01000000000',
      advert: 'Y',
      messages: [
        {
          receiver: '01011112222',
          subject: '친구톡 제목',
          message: '친구톡 내용',
          buttons: [
            {
              name: '모바일 링크',
              linkType: 'WL',
              linkTypeName: '웹링크',
              linkMo: 'https://example.com',
            },
          ],
        },
      ],
      imageUrl: 'https://smartsms.aligo.in',
      testMode: 'Y',
    });

    console.log('Friendtalk result:', result);
  } catch (error) {
    console.error('Friendtalk send failed', error);
  }
}

await main();
