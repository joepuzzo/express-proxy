
const getUserInfo = ( userInfo = {} ) => {
  const defaultUserInfo = {
    'aud': 'microsoft:identityserver:7c12c80b-9fb5-4dec-abba-e43254ba4279',
    'iss': 'http://sso.lfg.com/adfs/services/trust',
    'iat': 1559766617,
    'exp': 1559770217,
    'group': [
      'Domain Users',
      'gp_autumn_plan_loader_prod',
      'gp_autumn_claims_specialist_prod',
      'gp_autumn_developer_prod'
    ],
    'email': 'ILoveJS@node.com',
    'First_Name': 'Joey',
    'Last_Name': 'Javascript',
    'user_id': 'joey.javascript',
    'apptype': 'Public',
    'appid': '7c12c80b-9fb5-4dec-abba-e43254ba4279',
    'authmethod': 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
    'auth_time': '2019-06-05T20:30:17.507Z',
    'ver': '1.0'
  };
  return Object.assign({}, defaultUserInfo, userInfo );
};

const getJwtPayload = (jwtPayload = {}) => {
  const defaultJWTPayload = {
    'authorities': [
      'ROLE_CI_LMB_EMPL_ABSENCE_PLAN_LOADER',
      'ROLE_CI_LMB_EMPL_ABSENCE_CLAIMS_SPECIALIST',
      'ROLE_CI_LMB_EMPL_ABSENCE_DEVELOPER'      
      
    ],
    'email': 'ILoveJS@node.com',
    'iss': 'autumn-user-service',
    'name': 'Joey Javascript',
    'permissions': [
      'PROGRAM_READ',
      'PROGRAM_WRITE',
      'EMPLOYER_READ',
      'EMPLOYER_WRITE',
      'CLAIM_READ',
      'CLAIM_WRITE',
      'EMPLOYEE_READ',
      'EMPLOYEE_WRITE',
      'VIEW_LOGS',
      'ADMIN_READ'
    ],
    'sub': 'joey.javascript'
  };
  return Object.assign({}, defaultJWTPayload, jwtPayload );
};

module.exports = {
  getUserInfo,
  getJwtPayload
};