const rimraf = require('rimraf');
const InlineDB = require('inlinedb');

const idbName = 'test';

rimraf.sync(idbName);

new InlineDB(idbName);
