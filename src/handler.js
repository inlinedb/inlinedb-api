const InlineDB = require('inlinedb');
const {Responder} = require('./responder');
const errors = require('./errors');
const {parseUrl} = require('./utils');

const IDB_OP = '/idb/database';
const TABLE_OP = '/idb/table';

class Handler {

  static isIdbQuery(url) {

    const conditions = [
      url.urlParts.length === 3,
      url.url === IDB_OP,
      url.url === TABLE_OP
    ];

    return url.urlParts[0] === 'idb' && conditions.some(condition => condition);

  }

  static parseRequest(request) {

    const url = parseUrl(request.url);
    const [idbName, tableName] = url.urlParts.slice(1, 3);

    return {
      idbName,
      isIdbQuery: Handler.isIdbQuery(url),
      method: request.method,
      originalRequest: request,
      query: url.query,
      tableName,
      url: url.url
    };

  }

  constructor(options) {

    this.options = Object.assign({
      allowDatabaseCreation: false,
      allowDatabaseDeletion: false,
      allowTableCreation: false,
      allowTableDeletion: false
    }, options);

  }

  get handler() {

    return (request, response, next) => {
      const parsedRequest = Handler.parseRequest(request);

      if (parsedRequest.isIdbQuery) {
        this.handleRequest(parsedRequest, response);
      } else {
        next();
      }
    };

  }

  handleDatabaseOperation(request, response) {

    return new Promise((resolve, reject) => {
      if (request.url === IDB_OP) {
        const idbName = request.query.get('name');

        if (!idbName) {
          return response.fail(errors.IDB_NAME_NOT_PROVIDED, 400, resolve);
        }

        if (request.method === 'POST') {
          if (this.options.allowDatabaseCreation) {
            new InlineDB(idbName);
            return response.pass({}, resolve);
          } else {
            return response.fail(errors.IDB_CREATION_DISALLOWED, 405, resolve);
          }
        }

        if (request.method === 'DELETE') {
          if (this.options.allowDatabaseDeletion) {
            new InlineDB(idbName).drop();
            return response.pass({}, resolve);
          } else {
            return response.fail(errors.IDB_DELETION_DISALLOWED, 405, resolve);
          }
        }

        return response.fail('', 400, resolve);
      }
      return reject();
    });

  }

  handleRequest(request, response) {

    const responder = new Responder(response);

    this.handleDatabaseOperation(request, responder)
      .catch(() => responder.fail(errors.UNKNOWN_ERROR, 500, () => {}));

  };

}

module.exports = Handler;