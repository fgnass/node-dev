var cluster = require('cluster');

if (cluster.isMaster) {
  function createWorker(i) {
    var worker = cluster.fork();
    worker.on('message', function (msg) {
      console.log('Message from worker' + i + ':', msg);
    });
    worker.on('exit', function (code) {
      console.log(`Worker #${i} exited with code: ${code}`);
    });
    return worker;
  }

  for (var i = 0; i < 2; i += 1) {
    console.log('Forking worker', i);
    createWorker(i);
  }
  process.once('SIGTERM', function () {
    console.log('Master received SIGTERM');
    cluster.disconnect(function () {
      console.log('All workers disconnected.');
    });
  });
} else {
  var server = require('./server');
  process.on('disconnect', function () {
    console.log(process.pid, 'disconnect received, shutting down');
    if (server.lisening) {
      server.close();
    }
  });
  process.send('Hello');
}
