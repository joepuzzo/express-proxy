const router = require('express').Router();
const logger = require('winston');

const getLogFile = logfile => (req, res, next) => {
  logger.info(`Getting ${logfile}`);
  const options = {
    root: `${__dirname}/../../`,
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile(logfile, options, (error) => {
    if (error) {
      logger.info('Error when attemptint to return log file', { error });
      next(error);
    } else {
      logger.info(`Sent ${logfile}`);
    }
  });
};

router.get('/combined', getLogFile('combined.log') );
router.get('/errors', getLogFile('errors.log') );

module.exports = router;

