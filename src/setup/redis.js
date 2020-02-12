const logger = require('winston');

const setupSpec = () => {
  const redis = require('redis-mock');
  const client = redis.createClient();
  config.redis.client = client;
};

const setup = () => {
  const redis = require('redis');
  const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port
  });
  client.on('error', function(err) {
    logger.error('Redis error', err);
  }); 
  config.redis.client = client;
};

module.exports = process.env.NODE_ENV === 'spec' ? setupSpec : setup;

