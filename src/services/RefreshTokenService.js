const logger = require('winston');
const uuidv4 = require('uuid/v4');

const validateRefreshToken = ( exp ) => { 
  const now = Date.now();
  logger.info(`Comparing tokens exp: ${new Date(exp).toString()} to ${new Date(now).toString()}`);
  const valid = exp > now;
  logger.info(valid ? 'Token is valid' : 'Token is invalid' );
  return valid;
};

class RefreshTokenService{

  constructor( tokenStore, options ){
    this.tokenStore = tokenStore;
    this.options = options;
  }
  
  async findAndValidateRefreshToken( id ){
    logger.info(`Finding refresh token by id ${id}`);
    const token = await this.tokenStore.get(id);
    logger.info(`Token ${token} was retrived.`);
    return token && validateRefreshToken(+token);
  }

  createNewToken(){
    const token = Date.now() + this.options.exp;
    const id = uuidv4();
    this.tokenStore.set(id,token);
    logger.info(`Created new token with id ${id} and exp ${new Date(token).toString()}`);
    return id;
  }

  async refreshRefreshToken(id){
    logger.info(`Atempting to refresh token with id ${id}`);
    const token = await this.tokenStore.get(id);
    if( token ){
      logger.info('Found token, performing refresh');
      this.tokenStore.set(id,Date.now() + this.options.exp);
    } else { 
      logger.info('No token found, unable to perform refresh');
      throw new Error('No token was found when attepting to refresh.');
    }
  }
}

module.exports = RefreshTokenService;