const logger = require('winston');

class InMemoryTokenStore {

  constructor(){
    this.map = new Map();
  }

  enableCleanup(){
    setInterval(() => this.cleanup(), 1000 * 60 * 60);
  }

  cleanup(){
    logger.info('Cleaning up our mess :)');
    this.map.forEach((exp, id)=>{
      logger.debug(`id: ${id}, exp: ${new Date(exp).toString()}`);
      const now = Date.now();
      const valid = exp > now;
      if( !valid ){
        logger.info(`Removing token with id: ${id}`);
        this.map.delete(id);
      }
    });
  }

  get(key){
    return new Promise((resolve)=>{
      resolve( this.map.get(key) );
    });
  }

  set(key, value){
    this.map.set(key, value);
  }

}

module.exports = InMemoryTokenStore;
