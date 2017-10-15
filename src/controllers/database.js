const {IDB_OP} = require('../constants');
const {Controller} = require('../controller');
const InlineDB = require('inlinedb');
const errors = require('../errors');
const status = require('http-status-codes');

const getMethods = options => ({
  delete: (request, response, done) => {

    if (options.allowDatabaseDeletion) {

      const idbName = request.query.get('name');

      new InlineDB(idbName).drop();

      return response.pass({}, done);

    }

    return response.fail(errors.IDB_DELETION_DISALLOWED, status.METHOD_NOT_ALLOWED, done);

  },
  post: (request, response, done) => {

    if (options.allowDatabaseCreation) {

      const idbName = request.query.get('name');

      new InlineDB(idbName);

      return response.pass({}, done);

    }

    return response.fail(errors.IDB_CREATION_DISALLOWED, status.METHOD_NOT_ALLOWED, done);

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
