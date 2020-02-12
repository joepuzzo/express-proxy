const Service = require('../services/RefreshTokenService');

const setup = () => {
  global.services.RefreshTokenService = new Service(config.refresh.store, {
    exp: config.refresh.exp
  });
};

module.exports = setup;