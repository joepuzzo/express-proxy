// Config file for local development
module.exports = {
  redis: {
    host: 'localhost',
    port: 6379
  },
  log: {
    console: {
      level: 'debug',
      timestamp: true
    },
    file: {
      level: 'debug',
      timestamp: true,
      tailable: true,
      filename: 'combined.log',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    error: {
      level: 'error',
      tailable: true,
      timestamp: true,
      filename: 'errors.log',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }
  },
  zipkin: {
    logger: {
      endpoint: 'http://zipkin:9411/api/v1/spans'
    },
    recorder: 'none'
  },
  OAuth: {
    callbackURL: 'https://localhost:3000/auth/callback',
    authorizationURL: 'https://sso.foo.com/adfs/oauth2/authorize',
    tokenURL: 'https://sso.foo.com/adfs/oauth2/token',
    clientID: '2345-2345-2345',
    audience: '2345-2345-2345''
  },
  services: {
    website: {
      url: 'http://localhost:4000'
    },
    bff: {
      url: 'http://localhost:8080'
    },
    fooService: {
      url: 'https://foo.com'
    },
  },
  cors: {
    url: 'https://localhost:3000'
  },
  session: {
    secret: 'cats',
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 2 //2m
    },
  },
  jwt: {
    exp: 30, // 30s,
    publicKey: 'PUBLIC-KEY-HERE', // ONLY FOR DEVELOPMENT!!
    privateKey: 'PRIVATE-KEY-HERE', // ONLY FOR DEVELOPMENT!!,
    cookieName: 'chocolate'
  },
  refresh: {
    exp: 1000 * 60, //1m
  },
  ssl: {
    // key and cert set in /setup/secrets.js
  }
};
