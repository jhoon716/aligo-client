import { createAligoClient } from '../dist/index.js';

const client = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
});

async function main() {
  try {
    const result = await client.sms.sendMass({
      sender: '01000000000',
      msgType: 'LMS',
      title: '개별 안내',
      messages: [
        { receiver: '01011112222', msg: '1번 고객님, 테스트 메세지입니다.' },
        { receiver: '01033334444', msg: '2번 고객님, 테스트 메세지입니다.' },
      ],
      testmodeYn: 'Y',
    });

    console.log('Mass send result:', result);
  } catch (error) {
    console.error('Mass send failed', error);
  }
}

await main();
