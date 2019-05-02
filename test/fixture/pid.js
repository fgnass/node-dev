require('http').createServer().listen(0);
console.log(process.pid);
process.on('SIGTERM', function () { process.exit(); });
