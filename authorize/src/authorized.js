const jwtParser = require('jsonwebtoken');
const logger = require('winston');
const { formatPublicKey } = require('./helpers');

/**
 * Helper function to check if arr1 contains at least one element from arr2
 * 
 * @param {*} arr1 
 * @param {*} arr2 
 */
const check = (arr1 = [], arr2 = []) => {
  return arr1.some(elem => arr2.includes(elem));
};

/**
 * 
 * Example given roles = [ 'ROLE1', 'ROLE3' ] people with ROLE1 OR ROLE2 are allowed
 * 
 * Example given roles = [ 'ROLE1' ] and permissions = [ 'PERM1', 'PERM2'] 
 * people with ROLE1 OR PERM1 OR PERM2 are allowed
 * 
 * @param {*} roles 
 * @param {*} permissions 
 */
const authorized = ({ roles = [], permissions = [], publicKey } = {}) => (req, res, next) => {
  logger.info('Checking if user is authorized.');

  if (!req.headers.authorization) {
    logger.info('No jwt on the request.');
    return res.sendStatus(401);
  }

  const jwt = req.headers.authorization.replace(/Bearer /g, '');

  logger.info('Found the jwt cookie on the request.');

  const options = {
    algorithms: ['RS256'],
    issuer: 'foo'
  };

  try {
    const decodedJwt = jwtParser.verify(jwt, formatPublicKey(publicKey), options);
    logger.info('Successfully decoded JWT');
    logger.debug('Decoded JWT:', decodedJwt);
    if (check(decodedJwt.authorities, roles) || check(decodedJwt.permissions, permissions)) {
      logger.info('User is authorized.');
      return next();
    }
    logger.info('User is NOT authorized.');
    return res.sendStatus(403);
  } catch (error) {
    logger.error('JWT could not be verified.', { error });
    return res.sendStatus(401);
  }

};

module.exports = authorized;