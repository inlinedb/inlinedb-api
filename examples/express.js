const express = require('express');
const idbApi = require('../');
const {restHandler} = require('./rest-handler');

const app = express();
const api = idbApi();

app.use(api);

app.use('/', restHandler);

app.listen(8080);
