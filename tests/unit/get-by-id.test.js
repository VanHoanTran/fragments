const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  //requests with authentication will get HTTP 200 response
  test('should return HTTP 200 response', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('A plain text fragment');

    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
  });

  test(`Accessing posted fragment should return back the same fragment`, async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('A plain text fragment');
    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app).get(`/v1/fragments/${id}`).auth('user2@email.com', 'password2');

    expect(res.text).toEqual('A plain text fragment');
  });

  // Can not access other's fragments even authenticated users
  test(`Accessing other's fragment should return HTTP 404 response`, async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('A plain text fragment');
    const id = JSON.parse(postRes.text).fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}`).auth('user2@email.com', 'password2');

    expect(res.statusCode).toBe(404);
  });

  //requests without authentication are rejected with code 401
  test('requests without authentication should return HTTP 401 response', () =>
    request(app).get('/v1/fragments/id').expect(401));

  // incorrect an username/password pair will be rejected with code 401
  test('requests with invalid username/password pair should return HTTP 401 response', () =>
    request(app)
      .get('/v1/fragments/id')
      .auth('InvalidUsername@email.com', 'InvalidPassword')
      .expect(401));
});

describe('GET /v1/fragments/:id.ext', () => {
  //
  test('A text/markdown can be converted to text/plain type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# markdown text test');

    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(res.get('Content-Type')).toEqual('text/plain');
  });

  // A text/markdown can be converted to text/html type
  test('A text/markdown can be converted to text/html type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# Markdown test');

    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');

    expect(res.get('Content-Type')).toEqual('text/html');
  });

  // A text/markdown can be converted to text/html type
  test('A text/markdown can be converted to text/html type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# Markdown test');

    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');

    expect(res.get('Content-Type')).toEqual('text/html');
  });

  // A text/markdown can be converted to text/html type
  test('The fragment should be rendered as html format', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# Markdown test');

    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');

    expect(res.text).toEqual('<h1>Markdown test</h1>\n');
  });

  // The fragment should be rendered as markdown
  test('The fragment should be rendered as markdown', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# Markdown test');

    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.md`)
      .auth('user1@email.com', 'password1');

    expect(res.text).toEqual('# Markdown test');
  });


  test('unsupported type conversion should return HTTP 415 response', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# Markdown test');

    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.png`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(415);
  });
});
