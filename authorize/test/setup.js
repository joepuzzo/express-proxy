const chai = require('chai');
const chaiBytes = require('chai-bytes');
chai.use(chaiBytes);


// Setup logger because its not availible
const winston = require('winston');
const { format } = winston;
const { combine, timestamp, json, prettyPrint } = format;
const myFormat = format.printf((info) => {
  const { timestamp: tmsmp, level, message, ...rest } = info;
  let log = `${tmsmp} - ${level}:\t${message}`;
  if ( !( Object.keys(rest).length === 0 && rest.constructor === Object ) ) {
    log = `${log}\n${JSON.stringify(rest, null, 2)}`;
  }
  return log;
});
const generateTransports = () => {
  const transports = [
    new winston.transports.Console({
      level: 'none',
    }),
  ];
  return transports;
}
winston.configure({
  transports: generateTransports(),
  format: combine(
    timestamp(),
    myFormat
  ),
});


