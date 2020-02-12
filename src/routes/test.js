const router = require('express').Router();
const logger = require('winston');
const { authenticateIDP, authenticateJWT } = require('../middleware/authentication');

router.post('/session', (req, res) => {
  logger.info('test/session');
  logger.info(`Setting ${req.body.field} to`, req.body.value);
  req.session[req.body.field] = req.body.value;
  res.sendStatus(200);
});

router.get('/idp', authenticateIDP, ( req, res) =>{
  logger.info('GET /testidp');
  res.sendStatus(200);
});

router.get('/jwt', authenticateJWT, ( req, res) =>{
  logger.info('GET /testjwt');
  res.sendStatus(200);
});

module.exports = router;
