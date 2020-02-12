const jwt = require('jsonwebtoken');

module.exports = () => {
  const pem = `-----BEGIN PUBLIC KEY-----\n${config.jwt.publicKey}\n-----END PUBLIC KEY-----`;
  return Buffer.from(pem, 'utf8');
};