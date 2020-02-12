const TokenStore = require('../stores/InMemoryTokenStore');

const setupSpec = () => {
  config.refresh.store = new TokenStore();
};

const setup = () => {
  const store = new TokenStore();
  store.enableCleanup();
  config.refresh.store = store;
};

module.exports = process.env.NODE_ENV === 'spec' ? setupSpec : setup;