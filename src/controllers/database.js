const {IDB_OP} = require('../constants');
const {Controller} = require('../controller');
const InlineDB = require('inlinedb');
const errors = require('../errors');

const getMethods = options => ({
  post: (request, response, done) => {
    if (options.allowDatabaseCreation) {
      new InlineDB(idbName);
      return response.pass({}, done);
    } else {
      return response.fail(errors.IDB_CREATION_DISALLOWED, 405, done);
    }
  },
  delete: (request, response, done) => {
    if (options.allowDatabaseDeletion) {
      new InlineDB(idbName).drop();
      return response.pass({}, done);
    } else {
      return response.fail(errors.IDB_DELETION_DISALLOWED, 405, done);
    }
  }
});
const preConditions = [
  {
    condition: request => !request.query.get('name'),
    message: errors.IDB_NAME_NOT_PROVIDED
  }
];
const stepInCondition = request => request.url === IDB_OP;

module.exports = options => new Controller(getMethods(options), preConditions, stepInCondition);
