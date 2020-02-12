const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

class MockStrategy extends OAuth2Strategy {
  
  constructor( options, verify ){
    super(options, verify);
    this._verify = verify;
  }

  authenticate(req, options){

    if( req.query.mock ){
      if( req.query.mock === 'success' ){
        this._verify(req, null, null, {}, (error, user) => {
          this.success(user);
        });
      }
      if( req.query.mock === 'error' ){
        this._verify(req, null, null, {}, () => {
          this.error();
        });
      }
      if( req.query.mock === 'nouser' ){
        this._verify(req, null, null, {}, () => {
          this.fail();
        });
      }
    } else {
      super.authenticate(req, options);
    }

  }

}

module.exports = MockStrategy;