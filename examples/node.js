const http = require('http');
const idbApi = require('../');
const {restHandler} = require('./rest-handler');

const api = idbApi();

const server = http.createServer((request, response) => api(request, response, () => restHandler(request, response)));

server.listen(8080);
