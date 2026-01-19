import { createAligoClient } from '../dist/index.js';

const client = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
});

async function main() {
  try {
    const history = await client.sms.list({ page: 1, pageSize: 30 });
    console.log('History:', history.list?.length ?? 0, 'items');

    const first = history.list?.[0];
    if (first?.mid) {
      const mid = typeof first.mid === 'string' ? Number(first.mid) : first.mid;
      const details = await client.sms.getDetails({ mid, page: 1, pageSize: 30 });
      console.log('Details for mid', mid, details.list?.length ?? 0, 'rows');
    }
  } catch (error) {
    console.error('Lookup failed', error);
  }
}

await main();
