const fs = require('fs');
const path = require('path');

const setup = () => {
  fs.readdirSync(path.join(__dirname, '../helpers')).forEach((file) => {
    const helper = file.replace('.js', '');
    helpers[helper] = require('../helpers/' + file);
  });
};

module.exports = setup;