class Handler {

  constructor(options) {

    this.options = Object.assign({
      createDatabase: false,
      createTable: false
    }, options);

  }

  get handler() {

    return (request, response, next) => {
      if (/^\/idb\//.test(request.url)) {
        this.handleRequest(request, response);
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
