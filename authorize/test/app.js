const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = () => {
  const app = express();
  app.use(cookieParser());
  return app;
};