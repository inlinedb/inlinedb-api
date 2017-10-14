const handler = (request, response) => {
  response.end('handling ' + request.url);
};

module.exports = (request, response, next) => {
  if (/^\/idb\//.test(request.url)) {
    handler(request, response);
  } else {
    next();
  }
};
