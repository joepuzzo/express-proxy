const config = require('../../config/config');
const whitelist = [config.cors.url, undefined, 'null'];

const setup = () => {
  config.cors = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }, 
    credentials: true
  };
};

module.exports = setup;