const express = require('express');
const idbApi = require('../');
const {restHandler} = require('./rest-handler');

const app = express();

app.use(idbApi);

app.use('/', restHandler);

app.listen(8080);
