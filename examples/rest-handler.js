const restHandler = (request, response) => {
  response.setHeader('Content-Type', 'text/html');
  response.end(`
    <h1>Hello!</h1>
    <h2>You have reached InlineDB API</h2>
  `);
};

module.exports = {
  restHandler
};
