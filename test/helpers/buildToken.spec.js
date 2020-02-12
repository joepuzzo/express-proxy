const expect = require('chai').expect;
const { getUserInfo, getJwtPayload } = require('../utils');

describe('buildToken', () => {

  it('should build a valid token when valid user info is passed', () => {
    const userInfo = getUserInfo();
    const token = helpers.buildToken(userInfo, 'prod');
    expect(token).to.deep.equal(getJwtPayload());
  });


  it('should build a valid token when valid user info is passed with no groups', () => {
    const userInfo = getUserInfo({
      group: null
    });
    const token = helpers.buildToken(userInfo, 'test');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
      ],
      permissions: [
      ]
    }));
  });


  it('should build a valid token for a test Claims Specialist', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_claims_specialist_test']
    });
    const token = helpers.buildToken(userInfo, 'test');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_CLAIMS_SPECIALIST',
      ],
      permissions: [
        'CLAIM_READ',
        'CLAIM_WRITE',
        'PROGRAM_READ',
        'EMPLOYER_READ',
        'EMPLOYEE_READ',
        'EMPLOYEE_WRITE'
      ]
    }));
  });

  it('should build a valid token for a dev Claims Specialist', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_claims_specialist_dev']
    });
    const token = helpers.buildToken(userInfo, 'dev');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_CLAIMS_SPECIALIST',
      ],
      permissions: [
        'CLAIM_READ',
        'CLAIM_WRITE',
        'PROGRAM_READ',
        'EMPLOYER_READ',
        'EMPLOYEE_READ',
        'EMPLOYEE_WRITE'
      ]
    }));
  });

  it('should build a valid token for a prod Claims Specialist', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_claims_specialist_prod']
    });
    const token = helpers.buildToken(userInfo, 'prod');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_CLAIMS_SPECIALIST',
      ],
      permissions: [
        'CLAIM_READ',
        'CLAIM_WRITE',
        'PROGRAM_READ',
        'EMPLOYER_READ',
        'EMPLOYEE_READ',
        'EMPLOYEE_WRITE'
      ]
    }));
  });

  it('should build a valid token for a preprod Claims Specialist', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_claims_specialist_preprod']
    });
    const token = helpers.buildToken(userInfo, 'preprod');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_CLAIMS_SPECIALIST',
      ],
      permissions: [
        'CLAIM_READ',
        'CLAIM_WRITE',
        'PROGRAM_READ',
        'EMPLOYER_READ',
        'EMPLOYEE_READ',
        'EMPLOYEE_WRITE'
      ]
    }));
  });

  it('should build a valid token for a dev Plan Loader', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_plan_loader_dev']
    });
    const token = helpers.buildToken(userInfo, 'dev');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_PLAN_LOADER',
      ],
      permissions: [
        'PROGRAM_READ',
        'PROGRAM_WRITE',
        'EMPLOYER_READ',
        'EMPLOYER_WRITE'
      ]
    }));
  });

  it('should build a valid token for a test Plan Loader', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_plan_loader_test']
    });
    const token = helpers.buildToken(userInfo, 'test');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_PLAN_LOADER',
      ],
      permissions: [
        'PROGRAM_READ',
        'PROGRAM_WRITE',
        'EMPLOYER_READ',
        'EMPLOYER_WRITE'
      ]
    }));
  });

  it('should build a valid token for a preprod Plan Loader', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_plan_loader_preprod']
    });
    const token = helpers.buildToken(userInfo, 'preprod');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_PLAN_LOADER',
      ],
      permissions: [
        'PROGRAM_READ',
        'PROGRAM_WRITE',
        'EMPLOYER_READ',
        'EMPLOYER_WRITE'
      ]
    }));
  });

  it('should build a valid token for a prod Plan Loader', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_plan_loader_prod']
    });
    const token = helpers.buildToken(userInfo, 'prod');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_PLAN_LOADER',
      ],
      permissions: [
        'PROGRAM_READ',
        'PROGRAM_WRITE',
        'EMPLOYER_READ',
        'EMPLOYER_WRITE'
      ]
    }));
  });

  it('should build a valid token for a dev Developer', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_developer_dev']
    });
    const token = helpers.buildToken(userInfo, 'dev');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_DEVELOPER',
      ],
      permissions: [
        'VIEW_LOGS',
        'ADMIN_READ'
      ]
    }));
  });

  it('should build a valid token for a test Developer', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_developer_test']
    });
    const token = helpers.buildToken(userInfo, 'test');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_DEVELOPER',
      ],
      permissions: [
        'VIEW_LOGS',
        'ADMIN_READ'
      ]
    }));
  });

  it('should build a valid token for a preprod Developer', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_developer_preprod']
    });
    const token = helpers.buildToken(userInfo, 'preprod');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_DEVELOPER',
      ],
      permissions: [
        'VIEW_LOGS',
        'ADMIN_READ'
      ]
    }));
  });

  it('should build a valid token for a prod Developer', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_developer_prod']
    });
    const token = helpers.buildToken(userInfo, 'prod');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'ROLE_CI_LMB_EMPL_ABSENCE_DEVELOPER',
      ],
      permissions: [
        'VIEW_LOGS',
        'ADMIN_READ'
      ]
    }));
  });


  it('should build a valid token for a dev Administrator', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_admin_dev']
    });
    const token = helpers.buildToken(userInfo, 'dev');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'GP_AUTUMN_ADMIN',
      ],
      permissions: [
        'ADMIN_READ',
        'ADMIN_WRITE'
      ]
    }));
  });

  it('should build a valid token for a test Administrator', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_admin_test']
    });
    const token = helpers.buildToken(userInfo, 'test');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'GP_AUTUMN_ADMIN',
      ],
      permissions: [
        'ADMIN_READ',
        'ADMIN_WRITE'
      ]
    }));
  });

  it('should build a valid token for a preprod Administrator', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_admin_preprod']
    });
    const token = helpers.buildToken(userInfo, 'preprod');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'GP_AUTUMN_ADMIN',
      ],
      permissions: [
        'ADMIN_READ',
        'ADMIN_WRITE'
      ]
    }));
  });

  it('should build a valid token for a prod Administrator', () => {
    const userInfo = getUserInfo({
      group: ['gp_autumn_admin_prod']
    });
    const token = helpers.buildToken(userInfo, 'prod');
    expect(token).to.deep.equal(getJwtPayload({
      authorities: [
        'GP_AUTUMN_ADMIN',
      ],
      permissions: [
        'ADMIN_READ',
        'ADMIN_WRITE'
      ]
    }));
  });

});

