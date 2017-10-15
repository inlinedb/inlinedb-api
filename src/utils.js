const urlParser = require('url');

const defineCaller = (request, response) => (callback, ...params) => callback(request, response, ...params);

const parseUrl = url => {

  const parsed = urlParser.parse(url);

  return {
    query: new urlParser.URLSearchParams(parsed.search),
    url: parsed.pathname,
    urlParts: parsed.pathname.split('/').slice(1)
  };

};

module.exports = {
  defineCaller,
  parseUrl
};
