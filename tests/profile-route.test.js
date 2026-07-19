const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');

const app = require('../app');

test('GET /api/profile exists and requires authentication', async () => {
  const server = app.listen(0);
  await once(server, 'listening');

  const address = server.address();
  const response = await new Promise((resolve, reject) => {
    const req = http.get(
      {
        host: '127.0.0.1',
        port: address.port,
        path: '/api/profile'
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body });
        });
      }
    );

    req.on('error', reject);
  });

  server.close();

  assert.notStrictEqual(response.statusCode, 404);
  assert.strictEqual(response.statusCode, 401);
});
