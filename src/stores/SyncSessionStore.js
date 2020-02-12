const session = require('express-session');

class SyncSessionStore extends session.Store {
  constructor(){
    super();
    this.sessions = {};
  }

  destroy(sid, callback) {
    delete this.sessions[sid];
    callback();
  }

  get(sid, callback) {
    callback(null, JSON.parse(this.sessions[sid]));
  }

  set(sid, sess, callback) {
    this.sessions[sid] = JSON.stringify(sess);
    callback();
  }
}

module.exports = SyncSessionStore;
