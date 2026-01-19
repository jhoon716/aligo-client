import { createAligoClient } from '../dist/index.js';

const client = createAligoClient({
  key: process.env.ALIGO_KEY ?? 'YOUR_API_KEY',
  userId: process.env.ALIGO_USER_ID ?? 'YOUR_USER_ID',
});

async function main() {
  try {
    const remain = await client.status.getRemain();
    console.log('Remaining counts:', remain);

    // Replace with a real reserved message ID before running.
    const midToCancel = process.env.ALIGO_CANCEL_MID
      ? Number(process.env.ALIGO_CANCEL_MID)
      : undefined;

    if (midToCancel) {
      const cancelResult = await client.sms.cancel({ mid: midToCancel });
      console.log('Cancel result:', cancelResult);
    } else {
      console.log('Set ALIGO_CANCEL_MID to cancel a scheduled message.');
    }
  } catch (error) {
    console.error('Status/cancel failed', error);
  }
}

await main();
