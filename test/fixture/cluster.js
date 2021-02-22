var cluster = require('cluster');

function createWorker(i) {
  var worker = cluster.fork();

  worker.on('message', function (msg) {
    console.log('Message from worker' + i + ':', msg);
  });

  worker.on('exit', function (code) {
    console.log('Worker', i, 'exited with code:', code);
  });

  return worker;
}

if (cluster.isWorker) {
  var server = require('./server');

  process.on('disconnect', function () {
    console.log(process.pid, 'disconnect received, shutting down');
    if (server.listening) {
      server.close();
    }
  });

  process.send('Hello');
}

if (cluster.isMaster) {
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
}
