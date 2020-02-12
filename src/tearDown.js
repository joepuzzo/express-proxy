module.exports = () => {
  delete global.services;
  delete global.helpers;
  delete global.config;
};