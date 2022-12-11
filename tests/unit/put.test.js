// tests/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).put('/v1/fragments/:id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .put('/v1/fragments/:id')
      .auth('InvalidUsername@email.com', 'InvalidPassword')
      .expect(401));

  // If the user update  with invalid fragment's id is denied.
  test('Updating with invalid fragment id should return HTTP 404 response ', async () => {
    const res = await request(app)
      .put('/v1/fragments/:id')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('A plain text fragment');

    expect(res.statusCode).toBe(404);
  });

  // Updating fragment with different type from the existing should return an HTTP 400 response
  test('Updating with a different type should return HTTP 400 response ', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('A plain text fragment');
    const id = JSON.parse(res1.text).fragment.id;

    const res2 = await request(app)
    .put(`/v1/fragments/${id}`)
    .auth('user1@email.com', 'password1')
    .set({ 'Content-Type': 'text/markdown' })
    .send('# Markdown test');
    
    expect(res2.statusCode).toBe(400);
  });

  // If the authenticated user update fragment with a correct type, it returns an HTTP 200 response
  test('Updating with correct type should return HTTP 200 response ', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('A plain text fragment');
    const id = JSON.parse(res1.text).fragment.id;

    const res2 = await request(app)
    .put(`/v1/fragments/${id}`)
    .auth('user1@email.com', 'password1')
    .set({ 'Content-Type': 'text/plain' })
    .send('Alternative plain text fragment');
    
    expect(res2.statusCode).toBe(200);
  });

    // If the authenticated user update fragment with a correct type, it should update the fragment's data
    test(`Updating with a correct type should change fragment's data`, async () => {
      const res1 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set({ 'Content-Type': 'text/plain' })
        .send('A plain text fragment');
      const id = JSON.parse(res1.text).fragment.id;
  
      await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('Alternative plain text fragment');

      const res3 = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      
      expect(res3.text).toEqual('Alternative plain text fragment');
    });

        // If the authenticated user update fragment with a correct type, it returns fragment's metadata with a formats array
        test(`Updating with a correct type should return fragment's metadata with a formats array`, async () => {
          const res1 = await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set({ 'Content-Type': 'text/plain' })
            .send('A plain text fragment');
          const id = JSON.parse(res1.text).fragment.id;
      
          const res3 = await request(app)
          .put(`/v1/fragments/${id}`)
          .auth('user1@email.com', 'password1')
          .set({ 'Content-Type': 'text/plain' })
          .send('Alternative plain text fragment');
    
          const formats = JSON.parse(res3.text).fragment.formats;
          expect(Array.isArray(formats)).toBe(true);
        });

});
