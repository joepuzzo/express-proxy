const logger = require('winston');

module.exports = (err, req, res, next) => {
  logger.info('An unexpected error occured', { error: err });
  logger.debug(err.stack);
  res.redirect('/failure');
};