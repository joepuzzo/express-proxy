const request = require('supertest');
const createApp = require('../../src/app');
const fs = require('fs');

describe('/logs', () => {

  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('Request to /logs/combined', () => {

    it('should return a 401 status code when no jwt cookie is present', async () => {
      await request(app)
        .get('/logs/combined')
        .expect(401);
    });

    it('should return a 401 status code when jwt cookie is present with malformed jwt', async () => {
      await request(app)
        .get('/logs/combined')
        .set('Cookie', [`${config.jwt.cookieName}=asdf`])
        .expect(401);
    });

    it('should return a 403 status code when a valid jwt cookie is present with NO LOG premission', async () => {
      const jwt = helpers.encodeJwt({
        iss: 'autumn-user-service',
      });
      await request(app)
        .get('/logs/combined')
        .set('Cookie', [`${config.jwt.cookieName}=${jwt}`])
        .expect(403);
    });

    it('should return a 200 status code when a valid cookie is present with the LOG premission', async () => {
      const writeStream = fs.createWriteStream('combined.log');
      writeStream.write('Hello World');
      writeStream.end();

      const jwt = helpers.encodeJwt({
        iss: 'foo',
        permissions: ['VIEW_LOGS']
      });

      await request(app)
        .get('/logs/combined')
        .set('Cookie', [`${config.jwt.cookieName}=${jwt}`])
        .expect(200);
    });

  });

});

