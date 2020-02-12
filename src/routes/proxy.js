const router = require('express').Router();
const request = require('request').defaults({jar: true, strictSSL: false});
const logger = require('winston');

const { authenticateIDP, authenticateJWT } = require('../middleware/authentication');

/* -------------------------------- Helper Functions -------------------------------- */
const handleError = (res, e, path) => {
  logger.error(`Unable to forward request to ${path}`, e);
  res.sendStatus(500);
};

const proxy = (service, regex) => ( req, res ) => {
  const path = `${config.services[service].url}${req.path.replace(regex, '')}`;
  logger.info(`Forwarding request to ${path}`);
  req.pipe(request(path)).on('error', (e) => handleError(res, e, path) ).pipe(res);
};

/* -------------------------------- BFF URl -------------------------------- */
router.post('/web/*', authenticateJWT, ( req, res) =>{
  const path = `${config.services.bff.url}${req.path.replace('/web', '')}`;
  logger.info(`Forwarding request to ${path}`);
  logger.debug(`BearerHeader: ${req.headers.authorization}`);
  req.pipe(request(path)).on('error', (e) => handleError(res, e, path) ).pipe(res);
});

/* -------------------------------- Service URLS -------------------------------- */
const serviceRegex = /services\/.*?\//;

router.get('/services/foo-service/*', authenticateJWT, proxy( 'fooService', serviceRegex ) );
router.get('/services/bff/*', authenticateJWT, proxy( 'bff', serviceRegex ) );

/* -------------------------------- Website URLS -------------------------------- */
router.get('/unauthorized', proxy('website'));
router.get('/transformed*', proxy('website'));
router.get('/env*', proxy('website'));
router.get('/favicon.ico', proxy('website'));
router.get('/failure', proxy('website'));

router.get('/*', authenticateIDP, ( req, res ) =>{
  const path = `${config.services.website.url}${req.path}`;
  logger.info(`Forwarding request to ${path}`);
  req.pipe(request(path)).on('error', (e) => handleError(res, e, path) ).pipe(res);
});

module.exports = router;
