const sinon = require('sinon');
const request = require('supertest');
const expect = require('chai').expect;
const createApp = require('../../src/app');
const { getUserInfo } = require('../utils');
 
describe('/auth', () => {

  let app;

  const sandbox = sinon.createSandbox();

  beforeEach( () => {
    app = createApp();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Request to /auth/login', () => {

    it('should redirect to idp with config variables', async () => {
      await request( app )
        .get('/auth/login')
        .expect(302)
        .expect('location', 'https://idp/as/authorization.oauth2?response_type=code&redirect_uri=https%3A%2F%2Ffoobar%2Fauth%2Fcallback&scope=foo%20bar&client_id=savageMaster');
    });
    
  });

  describe('Request to /auth/callback', () => {

    it('should redirect to idp with config variables when callback endpoint is called with no code', async () => {
      await request( app )
        .get('/auth/callback')
        .expect(302)
        .expect('location', 'https://idp/as/authorization.oauth2?response_type=code&redirect_uri=https%3A%2F%2Ffoobar%2Fauth%2Fcallback&client_id=savageMaster');
    });

    it('should return 302 when invalid code is sent', async () => {
      await request( app )
        .get('/auth/callback?code=asdf')
        .expect(302);
    });

    it('should redirect to /fail when authentication failed', async () => {
      await request( app )
        .get('/auth/callback?error=access_denied')
        .expect(302)
        .expect('location', '/auth/fail');
    });

    it('should redirect to /success when authentication succeeds', async () => {
      await request( app )
        .get('/auth/callback?mock=success')
        .expect(302)
        .expect('location', '/auth/success');
    });

    it('should redirect to /auth/login when error occurs', async () => {
      await request( app )
        .get('/auth/callback?mock=error')
        .expect(302)
        .expect('location', '/auth/login');
    });

    it('should redirect to /auth/fail when no user is loaded', async () => {
      await request( app )
        .get('/auth/callback?mock=nouser')
        .expect(302)
        .expect('location', '/auth/fail');
    });
    
  });

  describe('Request to /auth/success', () => {

    it('should call encodeJwt with result from buildToken', async () => {

      const user = getUserInfo();

      const buildTokenStub = sandbox.stub(helpers, 'buildToken').returns('foobar');
      const encodeJwtStub = sandbox.stub(helpers, 'encodeJwt');

      const agent = request.agent(app);

      await agent
        .post('/test/session')
        .send({
          field: 'passport', 
          value: { user }
        })
        .set('Accept', 'application/json')
        .expect(200);

      await agent
        .post('/test/session')
        .send({
          field: 'redirectTo', 
          value: '/foo/bar'
        })
        .set('Accept', 'application/json')
        .expect(200);

      await agent
        .get('/auth/success')
        .expect(302)
        .expect('location', '/foo/bar')
        .expect('set-cookie', /tempus=.* Path=\//);

      expect(buildTokenStub.called).to.be.true;
      expect(encodeJwtStub.called).to.be.true;
      expect(encodeJwtStub.args[0][0]).to.equal('foobar');

    });

    it('should call setCookie with result from encodeJwt', async () => {

      const user = getUserInfo();

      const buildTokenStub = sandbox.stub(helpers, 'buildToken').returns('foobar');
      const encodeJwtStub = sandbox.stub(helpers, 'encodeJwt').returns('bazraz');
      const setCookieStub = sandbox.spy(helpers, 'setCookie');

      const agent = request.agent(app);

      await agent
        .post('/test/session')
        .send({
          field: 'passport', 
          value: { user }
        })
        .set('Accept', 'application/json')
        .expect(200);

      await agent
        .post('/test/session')
        .send({
          field: 'redirectTo', 
          value: '/foo/bar'
        })
        .set('Accept', 'application/json')
        .expect(200);

      await agent
        .get('/auth/success')
        .expect(302)
        .expect('location', '/foo/bar')
        .expect('set-cookie', /tempus=.* Path=\//);

      expect(buildTokenStub.called).to.be.true;
      expect(encodeJwtStub.called).to.be.true;
      expect(setCookieStub.called).to.be.true;
      expect(setCookieStub.args[0][0]).to.equal('tempus');
      expect(setCookieStub.args[0][1]).to.equal('bazraz');

    });

    it('should redirect to redirectTo stored on session with a valid jwt cookie', async () => {

      const user = getUserInfo();

      const agent = request.agent(app);

      await agent
        .post('/test/session')
        .send({
          field: 'passport', 
          value: { user }
        })
        .set('Accept', 'application/json')
        .expect(200);

      await agent
        .post('/test/session')
        .send({
          field: 'redirectTo', 
          value: '/foo/bar'
        })
        .set('Accept', 'application/json')
        .expect(200);

      const res = await agent
        .get('/auth/success')
        .expect(302)
        .expect('location', '/foo/bar')
        .expect('set-cookie', /tempus=.* Path=\//);

      const jwt = res.headers['set-cookie'][0].replace('tempus=','').replace('; Path=/; HttpOnly; Secure', '');

      expect(helpers.validateJwt(jwt)).to.be.true;

    });

    it('should redirect to "/" with a valid jwt cookie when no redirectTo is stored on session', async () => {

      const user = getUserInfo();

      const agent = request.agent(app);

      await agent
        .post('/test/session')
        .send({
          field: 'passport', 
          value: { user }
        })
        .set('Accept', 'application/json')
        .expect(200);

      const res = await agent
        .get('/auth/success')
        .expect(302)
        .expect('location', '/')
        .expect('set-cookie', /tempus=.* Path=\//);

      const jwt = res.headers['set-cookie'][0].replace('tempus=','').replace('; Path=/; HttpOnly; Secure', '');

      expect(helpers.validateJwt(jwt)).to.be.true;

    });

    it('should no user is stored on session', async () => {

      const agent = request.agent(app);

      await agent
        .get('/auth/success')
        .expect(500);

    });
    
  });

});

