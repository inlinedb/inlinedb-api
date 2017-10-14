const http = require('http');
const idbApi = require('../');
const {restHandler} = require('./rest-handler');

const server = http.createServer((request, response) => idbApi(request, response, () => restHandler(request, response)));

server.listen(8080);
