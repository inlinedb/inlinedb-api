class Responder {

  constructor(response) {

    response.setHeader('Content-Type', 'application/json');

    this.response = response;

  }

  fail(message, statusCode, callback) {

    this.response.statusCode = statusCode;
    this.finish({message}, callback);

  };

  finish(data, callback) {

    this.response.write(JSON.stringify(data));
    this.response.end(callback);

  };

  pass(data, callback) {

    this.response.statusCode = 200;
    this.finish(data, callback);

  };

}

module.exports = {
  Responder
};
