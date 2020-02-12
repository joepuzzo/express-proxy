const SyncSessionStore = require('../stores/SyncSessionStore');
//const session = require('express-session');
//const RedisStore = require('connect-redis')(session);

const setupSpec = () => {
  config.session.store = new SyncSessionStore();
};

// const setup = () => {
//   config.session.store =new RedisStore({
//     client: config.redis.client
//   });
// };

// Use the default memory store
const setup = () => {
  return null;
};

module.exports = process.env.NODE_ENV === 'spec' ? setupSpec : setup;