const assert = require('node:assert/strict');
const { after, before, describe, it } = require('node:test');
const app = require('../server');

let server;
let baseUrl;

const request = async (path, options) => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  return { body, response };
};

describe('CloudCart API wiring', () => {
  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('serves the health route', async () => {
    const { body, response } = await request('/');

    assert.equal(response.status, 200);
    assert.equal(body, 'CloudCart Backend Running');
  });

  it('mounts auth register route with validation', async () => {
    const { body, response } = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'missing-fields@example.com' }),
    });

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
  });

  it('mounts auth login route with validation', async () => {
    const { body, response } = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'missing-password@example.com' }),
    });

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
  });

  it('protects cart routes', async () => {
    const { body, response } = await request('/api/cart');

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
  });
});
