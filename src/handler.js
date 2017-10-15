const {IDB_OP, TABLE_OP} = require('./constants');
const {Responder} = require('./responder');
const {parseUrl} = require('./utils');
const databaseController = require('./controllers/database');

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

  constructor(options) {

    this.options = Object.assign({
      allowDatabaseCreation: false,
      allowDatabaseDeletion: false,
      allowTableCreation: false,
      allowTableDeletion: false
    }, options);

    this.defineControllers();

  }

  defineControllers() {

    this.databaseController = databaseController(this.options);

  }

  handleRequest(request, response) {

    const responder = new Responder(response);

    this.databaseController.handle(request, responder)
      .catch(error => responder.fail(String(error), 500, () => {}));

  };

}

module.exports = Handler;
