var http = require('http');
var message = require('./message');

// Changes to this module should not cause a server restart:
require('./ignoredModule');

var server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(message);
  res.end('\n');
});

server.once('listening', function () {
  var addr = this.address();
  console.log('Server listening on %s:%s', addr.address, addr.port);
  console.log(message);
}).listen(0);

process.once('SIGTERM', function () {
  if (server.listening) {
    server.close();
  }
});

process.once('exit', function() {
  console.log('exit');
});

module.exports = server;
