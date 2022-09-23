// tests/unit/health.test.js

const request = require('supertest');

// Get our Express app object (we don't need the server part)
const app = require('../../src/app');


// the route is incorrect, it should return code 404
describe('/404 check return 404', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/404');
    expect(res.statusCode).toBe(404);
  });
});