const conf = require('../../config/config');

const setup = () => {
  global.config = conf;
  global.services = {};
  global.helpers = {};
};

module.exports = setup;