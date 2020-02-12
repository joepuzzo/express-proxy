const setup = require('../src/setup/setup');
const tearDown = require('../src/tearDown');

const chai = require('chai');

const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

before( async () => {
  await setup();
});

after(() => {
  tearDown();
});