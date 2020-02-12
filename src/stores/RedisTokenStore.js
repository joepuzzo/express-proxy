const setupRedis = require('../setup/redis');

class RedisTokenStore {

  constructor(){
    this.client = setupRedis();
  }

  get(key){
    return new Promise((resolve, reject)=>{
      this.client.get(key, (err, reply) => {
        // reply is null when the key is missing
        err ? reject(err) : resolve(reply);
      });
    });
  }

  set(key, value){
    this.client.set(key, value);
  }

}

module.exports = RedisTokenStore;
