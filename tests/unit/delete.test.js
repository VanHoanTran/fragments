// tests/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('DELETE /v1/fragments:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).delete('/v1/fragments/:id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments/:id')
      .auth('InvalidUsername@email.com', 'InvalidPassword')
      .expect(401));

  // If the user remove fragment with invalid fragment's id is denied.
  test('Removing a fragment with invalid id should return HTTP 404 response ', async () => {
    const res = await request(app)
      .delete('/v1/fragments/:id')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
  });

  // If the authenticated user remove fragment with a correct id, it returns an HTTP 200 response
  test('Removing a fragment with correct id should return HTTP 200 response ', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('A plain text fragment');
    const id = JSON.parse(res1.text).fragment.id;

    const res2 = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    
    expect(res2.statusCode).toBe(200);
  });

  // If the authenticated user remove fragment with a correct id, it returns an ok status 
  test('Removing a fragment with correct id should return an ok status ', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('A plain text fragment');
    const id = JSON.parse(res1.text).fragment.id;

    const res2 = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
  });

});
