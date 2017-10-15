const http = require('http');
const idbApi = require('../');
const {restHandler} = require('./rest-handler');

const api = idbApi();

const PORT = 8080;

const server = http.createServer((request, response) => api(request, response, () => restHandler(request, response)));

server.listen(PORT);
