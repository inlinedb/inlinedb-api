const express = require('express');
const idbApi = require('../');
const {restHandler} = require('./rest-handler');

const app = express();
const api = idbApi();

const PORT = 8080;

app.use(api);

app.use('/', restHandler);

app.listen(PORT);
