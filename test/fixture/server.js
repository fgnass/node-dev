const { createServer } = require('http');

const message = require('./message');

// Changes to this module should not cause a server restart:
require('./ignored-module');

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(message);
  res.end('\n');
});

server
  .once('listening', () => {
    const { address, port } = server.address();
    console.log('Server listening on %s:%s', address, port);
    console.log(message);
  })
  .listen(0);

process.once('SIGTERM', () => {
  if (server.listening) server.close();
});

process.once('beforeExit', () => console.log('exit'));

module.exports = server;
