import { createAligoClient } from '../dist/index.js';

const client = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
});

async function main() {
  try {
    const result = await client.sms.send({
      sender: '01000000000',
      receiver: '01011112222,01033334444',
      msg: 'aligo-client: basic send example',
      testmodeYn: 'Y', // set to 'Y' to avoid billing during tests
    });

    console.log('Send result:', result);
  } catch (error) {
    console.error('Send failed', error);
  }
}

await main();
