const expect = require('chai').expect;
const sinon = require('sinon');
const verifyCallback = require('../../src/passport/verifyCallback');

describe('verifyCallback', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should call RefreshTokenService createNewToken',  () => {
    const spy = sandbox.stub(services.RefreshTokenService , 'createNewToken');
    const req = {
      session: {}
    }; 
    verifyCallback(req, null, null, {}, ()=>{});
    expect(spy.called).to.be.true;
  });

  it('should set refresh on session when token is generated',  () => {
    const token = 'foobarbaz';
    sandbox.stub(services.RefreshTokenService, 'createNewToken').returns(token);
    const req = {
      session: {}
    }; 
    verifyCallback(req, null, null, {}, ()=>{});
    expect(req.session.refresh).to.equal(token);
  });

  it('should call done with profile when profile is passed',  () => {
    const spy = sandbox.spy();
    const req = {
      session: {}
    }; 
    const profile = {};
    verifyCallback(req, null, null, profile, spy);
    expect(spy.called).to.be.true;
    expect(spy.args[0][0]).to.equal(null);
    expect(spy.args[0][1]).to.equal(profile);
  });

  it('should call done with false when profile is falsey',  () => {
    const spy = sandbox.spy();
    const req = {
      session: {}
    }; 
    const profile = undefined;
    verifyCallback(req, null, null, profile, spy);
    expect(spy.called).to.be.true;
    expect(spy.args[0][0]).to.equal(null);
    expect(spy.args[0][1]).to.equal(false);
  });

  it('should call done with error when RefreshTokenService throws error',  () => {
    const spy = sandbox.spy();
    const error = new Error();
    const stub = sandbox.stub(services.RefreshTokenService, 'createNewToken').throws(error);
    const req = {
      session: {}
    }; 
    const profile = undefined;
    verifyCallback(req, null, null, profile, spy);
    expect(spy.called).to.be.true;
    expect(stub.called).to.be.true;
    expect(spy.args[0][0]).to.equal(error);
  });

});

