const setupGlobals = require('./globals');
const setupHelpers = require('./helpers');
const setupLogger = require('./logger');
const setupCors = require('./cors');
const setupSecrets = require('./secrets');
const setupSession = require('./session');
const setupTokenStore = require('./tokenStore');
const setupServices = require('./services');
const setupPassport = require('./passport');
//const setupRedis = require('./redis');

module.exports = async () => {
  // Sync setup scripts
  setupGlobals();
  setupLogger();
  setupHelpers();
  setupSecrets(); 
  setupCors();
  // setupRedis();
  setupSession();
  setupTokenStore();
  setupServices();
  setupPassport();

	// Async setup scripts
	// await setupAsyncStuff();
};
