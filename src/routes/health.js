const router = require('express').Router();
const logger = require('winston');

router.get('/health', (req, res) => {
  logger.silly('Health');
  res.send({ status: 'UP' });
});

module.exports = router;
