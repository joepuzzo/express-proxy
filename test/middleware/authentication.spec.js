const expect = require('chai').expect;
const sinon = require('sinon');
const { authenticateIDP, authenticateJWT } = require('../../src/middleware/authentication');

describe('authentication', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('authenticateIDP', () => {

    it('should redirect to /auth/login and set session redirectTo to req.path when req.isAuthenticated returns false', () => {
      const isAuthenticated = sandbox.stub().returns(false);
      const redirect = sandbox.spy();
      const next = sandbox.spy();
      const path = '/foo/bar';

      const req = {
        isAuthenticated, 
        session: {},
        path
      };
      const res = {
        redirect
      };

      authenticateIDP( req, res, next );

      expect(isAuthenticated.called).to.be.true;
      expect(redirect.called).to.be.true;
      expect(redirect.args[0][0]).to.equal('/auth/login');
      expect(next.called).to.be.false;
      expect(req.session.redirectTo).to.equal(path);

    });

    it('should call next when valid jwt is sent with request', () => {
      const isAuthenticated = sandbox.stub().returns(true);
      const redirect = sandbox.spy();
      const next = sandbox.spy();

      const req = {
        isAuthenticated, 
        session: {},
        cookies: {
          tempus: helpers.encodeJwt({ foo: 'bar' })
        }
      };
      const res = {
        redirect
      };

      authenticateIDP( req, res, next );

      expect(isAuthenticated.called).to.be.true;
      expect(redirect.called).to.be.false;
      expect(next.called).to.be.true;

    });

    describe('when isAuthenticated returns true', () => {
      
      let isAuthenticated, redirect, next, req, res, cookie, findAndValidateRefreshToken;
      const path = '/foo/bar';

      beforeEach(()=>{
        isAuthenticated = sandbox.stub().returns(true);
        redirect = sandbox.spy();
        next = sandbox.spy();
        cookie = sandbox.spy();

        req = {
          isAuthenticated, 
          session: {
            passport: {
              user: {}
            }
          },
          cookies: {},
          headers: {},
          path
        };
        res = {
          redirect, 
          cookie
        };

      });


      describe('and expired jwt is sent with request', () => {

        beforeEach(()=>{
          req.cookies.tempus = helpers.encodeJwt({ 
            foo: 'bar',
            exp: 1539000000
          });
        });
       
        it('should NOT call next, attempt to refresh, and redirect when no refresh token is found', async () => {
          findAndValidateRefreshToken = sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(false);
          await authenticateIDP( req, res, next );
          expect(redirect.called).to.be.true;
          expect(redirect.args[0][0]).to.equal('/auth/login');
          expect(next.called).to.be.false;
        });
  
        it('should call next, attempt to refresh, and succeed when valid refresh token was found', async () => {
          findAndValidateRefreshToken = sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(true);
          sandbox.stub( services.RefreshTokenService, 'refreshRefreshToken').resolves();
          const jwt = 'asdfasdf';
          sandbox.stub(helpers, 'encodeJwt').returns(jwt);
          sandbox.stub(helpers, 'buildToken').returns('foobar');
          sandbox.spy(helpers, 'setCookie');
          await authenticateIDP( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.true;
          expect(cookie.args[0][0]).to.equal('tempus');
          expect(cookie.args[0][1]).to.equal(jwt);
          expect(next.called).to.be.true;
        });
  
      });
  
  
      describe('when isAuthenticated returns true and invalid jwt is sent with request', () => {
  
        beforeEach(()=>{
          req.cookies.tempus = 'asdfasdfsadf';
        });

        it('should NOT call next, attempt to refresh, and redirect when no refresh token is found', async () => {
          findAndValidateRefreshToken = sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(false);
          await authenticateIDP( req, res, next );
          expect(redirect.called).to.be.true;
          expect(redirect.args[0][0]).to.equal('/auth/login');
          expect(next.called).to.be.false;
        });
  
        it('should call next, attempt to refresh, and succeed when valid refresh token was found', async () => {
          findAndValidateRefreshToken = sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(true);
          sandbox.stub( services.RefreshTokenService, 'refreshRefreshToken').resolves();
          const jwt = 'asdfasdf';
          sandbox.stub(helpers, 'encodeJwt').returns(jwt);
          sandbox.stub(helpers, 'buildToken').returns('foobar');
          sandbox.spy(helpers, 'setCookie');
          await authenticateIDP( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.true;
          expect(cookie.args[0][0]).to.equal('tempus');
          expect(cookie.args[0][1]).to.equal(jwt);
          expect(next.called).to.be.true;
        });
  
      });

      describe('when isAuthenticated returns true and NO jwt is sent with request', () => {

        it('should NOT call next, attempt to refresh, and redirect when no refresh token is found', async () => {
          findAndValidateRefreshToken = sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(false);
          await authenticateIDP( req, res, next );
          expect(redirect.called).to.be.true;
          expect(redirect.args[0][0]).to.equal('/auth/login');
          expect(next.called).to.be.false;
        });
  
        it('should call next, attempt to refresh, and succeed when valid refresh token was found', async () => {
          findAndValidateRefreshToken = sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(true);
          sandbox.stub( services.RefreshTokenService, 'refreshRefreshToken').resolves();
          const jwt = 'asdfasdf';
          sandbox.stub(helpers, 'encodeJwt').returns(jwt);
          sandbox.stub(helpers, 'buildToken').returns('foobar');
          sandbox.spy(helpers, 'setCookie');
          await authenticateIDP( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.true;
          expect(cookie.args[0][0]).to.equal('tempus');
          expect(cookie.args[0][1]).to.equal(jwt);
          expect(next.called).to.be.true;
        });
  
      });

    });

  });

  describe('authenticateJWT', () => {

    it('should call next when valid jwt is sent with request', async () => {
      const redirect = sandbox.spy();
      const next = sandbox.spy();

      const req = {
        session: {},
        cookies: {
          tempus: helpers.encodeJwt({ foo: 'bar' })
        }
      };
      const res = {
        redirect
      };

      await authenticateJWT( req, res, next );

      expect(redirect.called).to.be.false;
      expect(next.called).to.be.true;

    });

    describe('when the jwt is invalid because', () => {

      let redirect, next, req, res, cookie, sendStatus;

      beforeEach(()=>{
        redirect = sandbox.spy();
        next = sandbox.spy();
        sendStatus = sandbox.spy();
        cookie = sandbox.spy();
        req = {
          session: {
            passport: {
              user: {}
            }
          },
          cookies: {},
          headers: {},
        };
        res = {
          redirect, 
          cookie,
          sendStatus
        };
        sandbox.stub(helpers, 'buildToken').returns('foobar');
        sandbox.spy(helpers, 'setCookie');
      });

      afterEach(()=>{
        req.cookies = {};
      });

      describe('its expired', () => {

        beforeEach(()=>{
          req.cookies.tempus = helpers.encodeJwt({ 
            foo: 'bar',
            exp: 1539000000,
          });
        });
  
        it('should NOT call next when expired jwt is sent with request, and send 403 when no valid refresh token is found', async() => {
          sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(false);
          await authenticateJWT( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.false;
          expect(sendStatus.called).to.be.true;
          expect(sendStatus.args[0][0]).to.equal(403);
        });
  
        it('should call next when expired jwt is sent with request, and set new cookie when a valid refresh token is found', async() => {
          sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(true);
          sandbox.stub( services.RefreshTokenService, 'refreshRefreshToken').resolves();
          const jwt = 'asdfasdf';
          sandbox.stub(helpers, 'encodeJwt').returns(jwt);
          await authenticateJWT( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.true;
          expect(cookie.args[0][0]).to.equal('tempus');
          expect(cookie.args[0][1]).to.equal(jwt);
          expect(next.called).to.be.true;
        });

      });  


      describe('its invalid', () => {

        beforeEach(()=>{
          req.cookies.tempus = 'khjasdfhjkfds';
        });
  
        it('should NOT call and send 403 when no valid refresh token is found', async() => {
          sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(false);
          await authenticateJWT( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.false;
          expect(sendStatus.called).to.be.true;
          expect(sendStatus.args[0][0]).to.equal(403);
        });
  
        it('should call next and set new cookie when a valid refresh token is found', async() => {
          sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(true);
          sandbox.stub( services.RefreshTokenService, 'refreshRefreshToken').resolves();
          const jwt = 'asdfasdf';
          sandbox.stub(helpers, 'encodeJwt').returns(jwt);
          await authenticateJWT( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.true;
          expect(cookie.args[0][0]).to.equal('tempus');
          expect(cookie.args[0][1]).to.equal(jwt);
          expect(next.called).to.be.true;
        });

        it('should NOT next and send 500 when finding a valid refresh token throws error', async() => {
          sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').throws(new Error());
          await authenticateJWT( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.false;
          expect(next.called).to.be.false;
          expect(sendStatus.called).to.be.true;
          expect(sendStatus.args[0][0]).to.equal(500);
        });

        it('should NOT call next but still set a new cookie when a valid refresh token is found, refreshing jwt succeeds, BUT refreshing refresh token fails', async() => {
          sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(true);
          sandbox.stub( services.RefreshTokenService, 'refreshRefreshToken').throws(new Error());
          const jwt = 'asdfasdf';
          sandbox.stub(helpers, 'encodeJwt').returns(jwt);
          await authenticateJWT( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.true;
          expect(cookie.args[0][0]).to.equal('tempus');
          expect(cookie.args[0][1]).to.equal(jwt);
          expect(sendStatus.called).to.be.true;
          expect(sendStatus.args[0][0]).to.equal(500);
          expect(next.called).to.be.false;
        });


      });  

      describe('its not there', () => {
  
        it('should NOT call and send 403 when no valid refresh token is found', async() => {
          sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(false);
          await authenticateJWT( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.false;
          expect(sendStatus.called).to.be.true;
          expect(sendStatus.args[0][0]).to.equal(403);
        });
  
        it('should call next and set new cookie when a valid refresh token is found', async() => {
          sandbox.stub( services.RefreshTokenService, 'findAndValidateRefreshToken').resolves(true);
          sandbox.stub( services.RefreshTokenService, 'refreshRefreshToken').resolves();
          const jwt = 'asdfasdf';
          sandbox.stub(helpers, 'encodeJwt').returns(jwt);
          await authenticateJWT( req, res, next );
          expect(redirect.called).to.be.false;
          expect(cookie.called).to.be.true;
          expect(cookie.args[0][0]).to.equal('tempus');
          expect(cookie.args[0][1]).to.equal(jwt);
          expect(next.called).to.be.true;
        });

      });  

    });

  });


});

