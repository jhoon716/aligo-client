import assert from 'node:assert/strict';
import test from 'node:test';
import { AligoError, createAligoClient } from '../dist/index.js';

test('send serializes urlencoded body without attachments', async () => {
  const originalFetch = globalThis.fetch;
  let capturedInit: RequestInit | undefined;
  let capturedUrl = '';

  globalThis.fetch = async (url, init) => {
    capturedUrl = typeof url === 'string' ? url : String(url);
    capturedInit = init ?? undefined;
    return new Response(
      JSON.stringify({
        result_code: 1,
        message: '',
        msg_id: 123,
        success_cnt: 1,
        error_cnt: 0,
        msg_type: 'SMS',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  };

  try {
    const client = createAligoClient({
      key: 'test-key',
      userId: 'user-1',
      baseUrl: 'https://apis.aligo.in',
    });

    await client.sms.send({
      sender: '01012345678',
      receiver: '01000000000',
      msg: 'hello',
    });

    assert.ok(capturedUrl.endsWith('/send/'));
    assert.ok(capturedInit?.body instanceof URLSearchParams);
    const params = capturedInit?.body as URLSearchParams;
    const encoded = params.toString();
    assert.ok(encoded.includes('key=test-key'));
    assert.ok(encoded.includes('user_id=user-1'));
    assert.ok(encoded.includes('sender=01012345678'));
    assert.ok(encoded.includes('receiver=01000000000'));
    assert.ok(encoded.includes('msg=hello'));

    const headers = new Headers(capturedInit?.headers);
    assert.equal(headers.get('content-type'), 'application/x-www-form-urlencoded;charset=UTF-8');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('send switches to multipart when attachments are present', async () => {
  const originalFetch = globalThis.fetch;
  let capturedInit: RequestInit | undefined;

  globalThis.fetch = async (_url, init) => {
    capturedInit = init ?? undefined;
    return new Response(JSON.stringify({ result_code: 1, message: '' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const client = createAligoClient({
      key: 'test-key',
      userId: 'user-1',
      baseUrl: 'https://apis.aligo.in',
    });

    await client.sms.send({
      sender: '01012345678',
      receiver: '01000000000',
      msg: 'hello',
      image1: {
        data: Buffer.from('image-bytes'),
        filename: 'photo.jpg',
        contentType: 'image/jpeg',
      },
    });

    assert.ok(capturedInit?.body instanceof FormData);
    const form = capturedInit?.body as FormData;
    const imagePart = form.get('image1');
    assert.ok(imagePart instanceof Blob);
    assert.equal((imagePart as File).name ?? 'photo.jpg', 'photo.jpg');

    const headers = new Headers(capturedInit?.headers);
    assert.equal(headers.get('content-type'), null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('negative result_code throws AligoError with code attached', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        result_code: -101,
        message: '인증오류입니다.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );

  const client = createAligoClient({
    key: 'test-key',
    userId: 'user-1',
    baseUrl: 'https://apis.aligo.in',
  });

  try {
    await assert.rejects(
      () =>
        client.sms.send({
          sender: '01012345678',
          receiver: '01000000000',
          msg: 'hello',
        }),
      (error: unknown) => {
        assert.ok(error instanceof AligoError);
        assert.equal(error.resultCode, -101);
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('sendMass validates message count before hitting network', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error('fetch should not be called for invalid input');
  };

  const client = createAligoClient({
    key: 'test-key',
    userId: 'user-1',
    baseUrl: 'https://apis.aligo.in',
  });

  try {
    await assert.rejects(
      () =>
        client.sms.sendMass({
          sender: '01012345678',
          msgType: 'SMS',
          messages: [],
        }),
      (error: unknown) => {
        assert.ok(error instanceof AligoError);
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
