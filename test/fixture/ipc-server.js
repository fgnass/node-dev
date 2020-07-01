var http = require('http');
var message = require('./message');

var server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(message);
  res.end('\n');
});

server.on('listening', function () {
  var addr = this.address();
  console.log('Server listening on %s:%s', addr.address, addr.port);
  console.log(message);
}).listen(0);

process.on('message', function (data) {
  if (data === 'node-dev:restart') {
    console.log('ipc-server.js - IPC received');
    server.close();
  }
});

process.on('exit', function () {
  console.log('exit');
});

process.on('SIGTERM', function () {
  server.close();
});
