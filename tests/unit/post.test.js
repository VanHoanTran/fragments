// tests/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .post('/v1/fragments')
      .auth('InvalidUsername@email.com', 'InvalidPassword')
      .expect(401));

  // If the user post unsupported type will  receive an HTTP 415 response
  test('Posting unsupported type should return HTTP 415 response ', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'audio/mpeg' })
      .send('12 12 12 12 12');

    expect(res.body.status).toBe('error');
    expect(res.statusCode).toBe(415);
  });
  // If the authenticated user posts supported type, it returns an HTTP 201 response
  test('Posting supported type should return HTTP 201 response ', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('A plain text fragment');

    expect(res.statusCode).toBe(201);
  });

  // the successful post will be responded with Location header
  test('response should contain the Location header', async () => {
    const API_URL = process.env.API_URL;
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('A plain text fragment');
    const id = JSON.parse(res.text).fragment.id;
    expect(res.headers.location).toEqual(`${API_URL}/v1/fragments/${id}`);
  });
});
