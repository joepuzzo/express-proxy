const { getNamespace } = require('cls-hooked');
const winston = require('winston');
const { format } = winston;
const { combine, timestamp, json, prettyPrint } = format;

// Define function for adding trace data
const trace = format((info, opts) => {
  const ctx = getNamespace('zipkin');
  if (ctx) {
    const traceinfo = ctx.get('zipkin');
    return traceinfo ? Object.assign(info, {
      traceid: traceinfo._traceId.value,
      spanid: traceinfo._spanId,
    }) : info;
  }
  return info;
});

// Custom log format function
const myFormat = format.printf((info) => {
	// Grab data off of info
  const { timestamp: tmsmp, level, message, traceid, spanid, error, ...rest } = info;

	// Build the log string
  let log = `${tmsmp} - ${traceid} - ${spanid} - ${level}:\t${message}`;

	// Only if there is an error build a special error log format
	if ( error ) {
    if (error.status) log = `${log}\nStatus: ${error.status}`;
    if ( error.stack) log = `${log}\n${error.stack}`;
    if (process.env.NODE_ENV !== 'prod') log = `${log}\n${JSON.stringify(error, null, 2)}`;
  }

	// Check if rest is an object and stringify it if so 
  if ( !( Object.keys(rest).length === 0 && rest.constructor === Object ) ) {
    log = `${log}\n${JSON.stringify(rest, null, 2)}`;
  }

  return log;
});


const generateTransports = () => {
  // Winston transports
  const transports = [
    new winston.transports.Console(config.log.console),
    // Add other transports here
    /*
    * See:
    * https://github.com/winstonjs/winston/blob/master/docs/transports.md
    */
  ];

  if(process.env.NODE_ENV !== 'spec'){
    transports.push(new winston.transports.File(config.log.file));
    transports.push(new winston.transports.File(config.log.error));
  }

  return transports;
}

const setup = () => {
  winston.configure({
    transports: generateTransports(),
    //exceptionHandlers: generateTransports(),
    format: combine(
      trace(),
      timestamp(),
      myFormat
    ),
    // Prevent winston from exeting on uncaught error
    exitOnError: false
  });
}

module.exports = setup;
