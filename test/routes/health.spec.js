const expect = require('chai').expect;
const request = require('supertest');
const createApp = require('../../src/app');

describe('/health', () => {

  describe('Request to /health', () => {

    let app;

    beforeEach( () => {
      app = createApp();
    });

    it('should return a 200 status code', async () => {
      await request( app )
        .get('/health')
        .expect(200);
    });

  });

  it('should build app', () => {
    expect(createApp()).to.not.be.null;
  });

});

