const request = require('supertest');
const { expect } = require('chai');
const jsonwebtoken = require('jsonwebtoken');

const createApp = require('./app');
const { authorize, helpers } = require('../index');

describe('helpers', () => {

  const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzB3paRbs8XJlT5hXX/zjt4D4GMRRQ1T14fFNNS20UJOqIVjQLPJQCCMU7gWn3iVDdQYrVPKUZc+YnG3GT1nRBVRQ9+SL8k3DaLwB5+ENshnPGqkjlv3AGm6kfqQV7SmxwiXgAGQoz6kAF8g+0NPNIfS8sCDUWxAuYiqmJOEeqFO+M77HQzqyCUKD6oLfOm3VVxN4E7vTOmCDPOMUJKZI9GbxICbt+Fct85Ji5O5ZHFeCodUNAl4KvHnpXXjuelYBPzi0tItbkGBMYjZLBfyEwuO0rHppH+8aJ3dfwFNpUAQ87d0/3RUXXSJEOt9ZXM77ELn9UdIjBslHzLbZeBqvPwIDAQAB';
  const privateKey = 'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDMHelpFuzxcmVPmFdf/OO3gPgYxFFDVPXh8U01LbRQk6ohWNAs8lAIIxTuBafeJUN1BitU8pRlz5icbcZPWdEFVFD35IvyTcNovAHn4Q2yGc8aqSOW/cAabqR+pBXtKbHCJeAAZCjPqQAXyD7Q080h9LywINRbEC5iKqYk4R6oU74zvsdDOrIJQoPqgt86bdVXE3gTu9M6YIM84xQkpkj0ZvEgJu34Vy3zkmLk7lkcV4Kh1Q0CXgq8eeldeO56VgE/OLS0i1uQYExiNksF/ITC47Ssemkf7xond1/AU2lQBDzt3T/dFRddIkQ631lczvsQuf1R0iMGyUfMttl4Gq8/AgMBAAECggEAOm21iueNG/BrH8Wz/T4e0UCRxEUuHeAMIok4WKiknQwn/zO1I6iZUDr6msfzrZttG+qQLNjjseEjBmRGCCDlvGjOZKd/h/TKowhuYzoA+aJ5rmAMWAR7IRXa8IV34VO2FqVQ4cvKAueVpzkjAhQe/EFaYfCD2S1gmakrthLa+8O5m2fCMjSdTiDL003yRnF+3HkAU/eMD4oUiOJBrJuPfTCKiN2LMJz9gcC6dZauWV0TlZiDECuP9fL2/G0AiOIQMi3ivYhNxA0eyS8/ZS8mbnZUArHJxXrqPlOvSSoAsnKaw6c+xXjv6YHRzeJlPE8Z+sIMQVgQ6KALTa4n/9WpAQKBgQD6fA47V7e2yVLuyYYSwygBMlvntZ8FILIDYS+anygZJugZWyMbEoB5kbf0YIwcyjIe6PY/yRRb7Lsc4EpVe55AISZnbicBTv8W3k6VSL65qUr2dO91q9Cp8KGWem5VBi4Vv+fEd+9sVXyI/wCho4bP/X14N1xXgia50WbBiUogrwKBgQDQnHzxT4azKUE2wFloFIh1TcQpdpFlh4fMWEdc71Cbiq8ZXFJCtiEu4uoYMBcS8gf0qVAAFkN1XkeE/fJE2uAF1e/0sVXltpZV2izOPdyVh+an0s9ypRJTDJ185esO4OFveQoU7kRFXFal8zc18K4nqmE2yIZbnGuyzXE0BD5ecQKBgQCTZ4Pcij9TsuA6I5/h1LTrF16cWfZNxzLa6EtiW7z2KD44BbkACoBOimFNz69Elfyu0ftwB/4SJprqYFd+PLQhGyEFhv4vN/TH2WU3VsreaXDy3le40LaH+1KsQjpBkNR3+ioDJW1hPGGAIUiW1qvUJGG86B9QZAg0G7WzuP5FgwKBgQDHaK7uJGzIGeliot9T5DzElL+sOtClUrZ2mPQuW/ybkifqgBuJ9XsmzHWlBWMpEv6T2rzEOIPnT2XiNLU/KFH4ghZLurA3Ux/FlTY7N1sB/NR5G8R8/FnV1Ts9xrG4mTIlUnhWpaPRAYE6RJFEGHsBI5alvWzhaVZxpnxNkrjjoQKBgQCEGFVLQ/tp1bMrsplVHp2ddazx0WI6FzTBMvKURUPrL3Mk0HPKVNg3RiTJhthOt/WYU9VcPD+lNuT7U2YG0W2q5qiAyChLnmq0dwNDzerrB0h1bwLVuO5tB96TItdSkrgTskdrNci+ofeK0t9Mt3u/IQc5N3J7N/ralM2+BPkDmw==';

  describe('formatPublicKey', () => {
    
    it('should correctly format the public key', () => {
      const data = 'joe';
      const expected = new Buffer(`-----BEGIN PUBLIC KEY-----\n${data}\n-----END PUBLIC KEY-----`)
      const actual = helpers.formatPublicKey(data);
      expect( actual ).to.equalBytes(expected);
    });

  })

  describe('formatPrivateKey', () => {
    
    it('should correctly format the private key', () => {
      const data = 'joe';
      const expected = new Buffer(`-----BEGIN PRIVATE KEY-----\n${data}\n-----END PRIVATE KEY-----`)
      const actual = helpers.formatPrivateKey(data);
      expect( actual ).to.equalBytes(expected);
    });

  });

  describe('encodeJwt', () => {
    
    it('should correctly encode a jwt given an input and a valid private key', () => {
      const input = {
        foo: 'bar',
      }
      const options = {
        algorithms: ['RS256'],
      };
      const jwt = helpers.encodeJwt( input, privateKey, {
        expiresIn: 60 * 30, //30minutes
      });
      const decodedJwt = jsonwebtoken.verify(jwt, helpers.formatPublicKey(publicKey), options);
      expect( decodedJwt.foo ).to.equal('bar');
    });

  })
  
});




