const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  //requests with authentication will get HTTP 200 response
  test('should return HTTP 200 response', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('A plain text fragment');

    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
  });

  test(`Accessing posted fragment should return back the fragment metadata`, async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('A plain text fragment');
    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user2@email.com', 'password2');

    expect(JSON.parse(res.text)).toEqual(JSON.parse(postRes.text));
  });

  // Can not access other's fragments even authenticated users
  test(`Accessing other's fragment should return HTTP 404 response`, async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('A plain text fragment');
    const id = JSON.parse(postRes.text).fragment.id;
    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user2@email.com', 'password2');

    expect(res.statusCode).toBe(404);
  });

  //requests without authentication are rejected with code 401
  test('requests without authentication should return HTTP 401 response', () =>
    request(app).get('/v1/fragments/id/info').expect(401));

  // incorrect an username/password pair will be rejected with code 401
  test('requests with invalid username/password pair should return HTTP 401 response', () =>
    request(app)
      .get('/v1/fragments/id/info')
      .auth('InvalidUsername@email.com', 'InvalidPassword')
      .expect(401));
});
