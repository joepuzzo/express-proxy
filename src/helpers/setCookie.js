const logger = require('winston');

/**
 * Helper function for setting cookie
 *
 * @param cookie
 * @param res 
 */
module.exports = (name, cookie, res) => {
  logger.info(`Setting ${name} cookie`);
  res.cookie(name, cookie, { httpOnly: true, secure: true });
};