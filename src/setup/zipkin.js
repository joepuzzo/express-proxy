const logger = require('winston');
const { Tracer, BatchRecorder } = require('zipkin');
const CLSContext = require('./CLSContext');
const { HttpLogger } = require('zipkin-transport-http');

const config = require('../../config/config');

const ConsoleRecorder = {
  record: rec => logger.info(rec.annotation.toString()),
  toString: () => 'consoleTracer'
};

const NoRecorder = {
  record: () => { },
  toString: () => 'noTracer'
};

const recorders = {
  batch: new BatchRecorder({
    logger: new HttpLogger({
      endpoint: config.zipkin.logger.endpoint
    })
  }),
  console: ConsoleRecorder,
  none: NoRecorder
};

const zipkin = () => {
  const ctxImpl = new CLSContext();
  const tracer = new Tracer({
    ctxImpl,
    recorder: recorders[config.zipkin.recorder],
    traceId128Bit: true
  });
  config.zipkin.tracer = tracer;
};

module.exports = zipkin;
