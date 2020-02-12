const express = require('express');
const health = require('./routes/health');
const auth = require('./routes/auth');
const logs = require('./routes/logs');
const proxy = require('./routes/proxy');
const test = require('./routes/test');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('winston');
const { authorized } = require('../authorize'); // THIS SHOULD BE EXTERNAL DEPENDENCY!
const jwtFilter = require('./middleware/jwtFilter');
const errorHandler = require('./middleware/errorHandler');

module.exports = () => {

  logger.info(`Building app in the ${process.env.NODE_ENV} environment.`);

  // Create new express app
  const app = express();

  // Add external middleware
  app.use(cors(config.cors));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session(config.session));
  app.use(passport.initialize());
  app.use(passport.session());

  // Test endpoints
  if (process.env.NODE_ENV === 'spec') {
    app.use('/test', bodyParser.json(), test);
  }

  // Health endpoints
  app.use(health);

  // Setup auth routes 
  app.use('/auth', auth);

  // Add JWT Filter to move the jwt cookie to an Authorization header
  app.use(jwtFilter);

  // Add logging endpoints
  app.use('/logs',
    authorized({
      publicKey: config.jwt.publicKey,
      permissions: ['VIEW_LOGS']
    }),
    logs);

  // Setup proxy routes
  app.use(proxy);

  // Add error handler
  app.use(errorHandler);

  return app;

};
