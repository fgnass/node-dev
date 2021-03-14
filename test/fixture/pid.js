const server = require('http').createServer().listen(0);
console.log(process.pid);
process.once('SIGTERM', () => server.close());
