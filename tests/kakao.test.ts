import assert from 'node:assert/strict';
import test from 'node:test';
import { AligoError, createAligoClient } from '../dist/index.js';

test('kakao auth uses apikey/userid fields and kakao base URL', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';
  let capturedBody: unknown;

  globalThis.fetch = async (url, init) => {
    capturedUrl = typeof url === 'string' ? url : String(url);
    capturedBody = init?.body;
    return new Response(JSON.stringify({ code: 0, message: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const client = createAligoClient({
      key: 'k-key',
      userId: 'k-user',
    });

    await client.kakao.profile.requestAuth({
      plusId: '@channel',
      phoneNumber: '01012341234',
    });

    assert.ok(capturedUrl.startsWith('https://kakaoapi.aligo.in/akv10/profile/auth/'));
    assert.ok(capturedBody instanceof URLSearchParams);
    const params = capturedBody as URLSearchParams;
    const encoded = params.toString();
    assert.ok(encoded.includes('apikey=k-key'));
    assert.ok(encoded.includes('userid=k-user'));
    assert.ok(encoded.includes('plusid=%40channel'));
    assert.ok(encoded.includes('phonenumber=01012341234'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('kakao token uses path params for time and type', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';
  let capturedBody: unknown;

  globalThis.fetch = async (url, init) => {
    capturedUrl = typeof url === 'string' ? url : String(url);
    capturedBody = init?.body;
    return new Response(JSON.stringify({ code: 0, message: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const client = createAligoClient({
      key: 'k-key',
      userId: 'k-user',
    });

    await client.kakao.token.create({
      time: 30,
      type: 'alimtalk',
    });

    assert.ok(capturedUrl.endsWith('/akv10/token/create/30/alimtalk'));
    assert.ok(capturedBody instanceof URLSearchParams);
    const params = capturedBody as URLSearchParams;
    const encoded = params.toString();
    assert.ok(encoded.includes('apikey=k-key'));
    assert.ok(encoded.includes('userid=k-user'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('kakao code < 0 raises AligoError carrying resultCode', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () =>
    new Response(JSON.stringify({ code: -99, message: '인증오류입니다.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  const client = createAligoClient({
    key: 'k-key',
    userId: 'k-user',
  });

  try {
    await assert.rejects(
      () =>
        client.kakao.templates.list({
          senderKey: 'senderKey',
        }),
      (error: unknown) => {
        assert.ok(error instanceof AligoError);
        assert.equal(error.resultCode, -99);
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('kakao friendtalk with image switches to multipart', async () => {
  const originalFetch = globalThis.fetch;
  let capturedBody: unknown;

  globalThis.fetch = async (_url, init) => {
    capturedBody = init?.body;
    return new Response(JSON.stringify({ code: 0, message: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const client = createAligoClient({
    key: 'k-key',
    userId: 'k-user',
  });

  try {
    await client.kakao.sendFriendtalk({
      senderKey: 'senderKey',
      sender: '01000000000',
      messages: [{ receiver: '01011112222', subject: 'hi', message: 'hello' }],
      image: {
        data: Buffer.from('image-bytes'),
        filename: 'pic.jpg',
        contentType: 'image/jpeg',
      },
    });

    assert.ok(capturedBody instanceof FormData);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
