const defaultConfig = require('./env/default');
const config = require(`./env/${process.env.NODE_ENV}`);

module.exports = { ...defaultConfig, ...config };
