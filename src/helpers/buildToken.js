const logger = require('winston');

const groupMap = {
  namespace_role_foo: 'ROLE_FOO',
  namespace_role_developer: 'ROLE_DEVELOPER',
  namespace_role_admin: 'ROLE_ADMIN',
};

const transformGroupToAuthority = group => groupMap[group.replace(/_dev\b|_test\b|_prod\b|_preprod\b/, '')];

/**
 * Private helper function that builds authorities from groups
 */
const buildAuthorities = groups => {
  if (!groups) {
    return [];
  }
  // if a user only has one group, a string is returned instead of an array of strings
  return Array.isArray(groups) ? groups.map(transformGroupToAuthority) : [transformGroupToAuthority(groups)];
};

/**
 * Private helper function that builds permissions from authorities
 */
const permissionMap = {
  ROLE_FOO: ['FOO_READ', 'FOO_WRITE'],
  ROLE_DEVELOPER: ['VIEW_LOGS', 'ADMIN_READ'],
  ROLE_ADMIN: ['ADMIN_READ', 'ADMIN_WRITE']
};
const buildPermissions = (authorities) => {
  if (!authorities) {
    return [];
  }
  let permissions = new Set();
  authorities.forEach((authority) => {
    if (permissionMap[authority]) {
      permissions = new Set([...permissions, ...permissionMap[authority]]);
    }
  });
  return [...permissions];
};


const getGroups = (groups, env) => {
  if (!groups) return [];
  logger.info(`Getting groups for ${env} environment.`);
  // ADD CUSTOM LOGIC HERE IF GROUPS DIFFER BASED ON ENV
  return groups;
};

/**
 * Helper function builds json web token data from adfs user info
 * the JWT
 * 
 * EXAMPLE TURN THIS:
 * process.env.NODE_ENV === 'test'
 * {
  "aud": "microsoft:identityserver:7c12...",
  "iss": "http://sso.foo.com/adfs/services/trust",
  "iat": 1559766617,
  "exp": 1559770217,
  "group": [
    "namespace_role_foo",
    "namespace_role_developer",
    "namespace_role_admin",
  ],
  "email": "ILoveJS@node.com",
  "First_Name": "Joey",
  "Last_Name": "Javascript",
  "user_id": "joey.javascript",
  "apptype": "Public",
  "appid": "7c12c80b-9fb5-4dec-abba-e43254ba4279",
  "authmethod": "http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows",
  "auth_time": "2019-06-05T20:30:17.507Z",
  "ver": "1.0"
}
 * 
 * INTO THIS
 * 
 * {
 *   authorities: [
 *     'ROLE_FOO',
 *     'ROLE_DEVELOPER',
 *     'ROLE_ADMIN',
 *   ],
 *   iss: 'express-proxy',
 *   sub: 'joey.javascript',
 *   permissions: ['FOO_READ', 'FOO_WRITE', 'ADMIN_READ', 'ADMIN_WRITE', 'VIEW_LOGS'],
 *   name: 'Joey Javascript',
 *   email: 'ILoveJS@node.com'
 * }
 */
module.exports = (userInfo, env) => {

  const groups = userInfo.group;
  const authorities = buildAuthorities(groups);
  const permissions = buildPermissions(authorities);
  logger.debug('Groups', groups);
  logger.debug('Built authorities', authorities);
  logger.debug('permissions', permissions);
  return {
    iss: 'autumn-user-service',
    sub: userInfo.user_id,
    name: `${userInfo.First_Name} ${userInfo.Last_Name}`,
    email: userInfo.email,
    authorities,
    permissions
  };
};
