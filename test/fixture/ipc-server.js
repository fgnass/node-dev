const { createServer } = require('http');

const message = require('./message');

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(message);
  res.end('\n');
});

server
  .on('listening', () => {
    const { address, port } = server.address();
    console.log(`Server listening on ${address}:${port}`);
    console.log(message);
  })
  .listen(0);

process.on('message', data => {
  if (data === 'node-dev:restart') {
    console.log('ipc-server.js - IPC received');
    server.close(() => process.exit(0));
  }
});

process.once('beforeExit', () => console.log('exit'));

process.once('SIGTERM', () => {
  if (server.listening) server.close(() => process.exit(0));
});
