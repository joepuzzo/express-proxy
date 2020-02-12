/**
 * AWS KMS Key Configuration
 *
 * Setup file for decrypting encrypted values
 */

const logger = require('winston');
const AWS = require('aws-sdk');
const fs = require('fs');

// Function that decrypts encrypted values
// and puts them into the configuration

const setupAWS = async () => {

  logger.info('Key configuration');

  const kms = new AWS.KMS({
    region: config.aws.region
  });

  const decrypt = (cipher) => {
    logger.info('Decrypting a cipher');
    const params = {
      CiphertextBlob: new Buffer(cipher, 'base64')
    };
    return kms.decrypt(params).promise();
  };

  try {

    // Values we want decrypted
    const [
      privateKey,
      sessionSecret,
      oauthSecret
    ] = await Promise.all([
      decrypt(config.jwt.privateKey),
      decrypt(config.session.secret),
      decrypt(config.OAuth.clientSecret)
    ]);

    // Overrite keys with unencrypted values
    config.jwt.privateKey = privateKey.Plaintext.toString();
    config.session.secret = sessionSecret.Plaintext.toString();
    config.OAuth.clientSecret = oauthSecret.Plaintext.toString();

    logger.info('Sucessfully decrypted ciphers');
  } catch (e) {
    logger.error('An error occured when attempting to decrypt value', e);
    throw e;
  }
};

const setupDocker = () => {
  logger.info('Setting up secrets for Docker');
  config.jwt.privateKey = fs.readFileSync('/run/secrets/jwt.private-key').toString().replace('\n', '');
  config.jwt.publicKey = fs.readFileSync('/run/secrets/jwt.public-key').toString().replace('\n', '');
  config.session.secret = fs.readFileSync('/run/secrets/session.secret').toString();
  // config.OAuth.clientSecret = 'CHANGEME'; // TODO: Change this to read from secrets
  config.ssl.key = fs.readFileSync('./config/ssl/private.key');
  config.ssl.cert = fs.readFileSync('./config/ssl/primary.crt');

  logger.debug('Config:', config);
};

const setupDevelopment = () => {
  logger.info('Setting up secrets for Local Development');

  config.ssl.key = fs.readFileSync('./config/ssl/private.key');
  config.ssl.cert = fs.readFileSync('./config/ssl/primary.crt');
};

const noop = () => { };

const env = process.env.NODE_ENV;

if (env === 'spec') {
  module.exports = noop;
} else if (env === 'development') {
  module.exports = setupDevelopment;
} else {
  module.exports = setupDocker;
}