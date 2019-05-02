var cluster = require('cluster');

function createWorker(i) {
  var worker = cluster.fork();
  worker.on('message', function (msg) {
    console.log('Message from worker', i, ':', msg);
  });
  worker.on('disconnect', function () {
    console.log('Worker disconnected', i);
  });
  return worker;
}

var workers = [];

if (cluster.isMaster) {
  for (var i = 0; i < 2; i += 1) {
    console.log('Forking worker', i);
    workers.push(createWorker(i));
  }
  process.on('SIGTERM', function () {
    console.log('Master received SIGTERM');
    workers.forEach(function (worker) {
      worker.disconnect();
    });
  });
} else {
  process.send('Hello');
  require('./server');
}
