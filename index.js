const InlineDB = require('inlinedb');

class Handler {

  static isIdbQuery(urlParts) {

    const [base, idbName, tableName] = urlParts;

    if (base !== 'idb') {
      return false;
    }

    return [
      urlParts.length === 3,
      idbName === 'database' && !tableName,
      idbName === 'table' && !tableName
    ].some(condition => condition);

  }

  static parseRequest(request) {

    const baseUrl = request.url.split('?')[0];
    const urlParts = baseUrl.replace(/^\//, '').split('/');
    const [idbName, tableName] = urlParts.slice(1, 3);

    return {
      idbName,
      isIdbQuery: Handler.isIdbQuery(urlParts),
      method: request.method,
      tableName,
      query: request.query,
      originalRequest: request
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

  handleRequest(request, response) {

    response.end('handling ' + request.url);

  };

}

module.exports = options => new Handler(options).handler;
