const { fork, isMaster, isWorker } = require('node:cluster');

const createWorker = i => {
  const worker = fork();

  worker.on('message', msg => {
    console.log(`Message from worker ${i}: ${msg}`);
  });

  worker.on('exit', code => {
    console.log(`Worker ${i} exited with code: ${code}`);
  });

  return worker;
};

if (isWorker) {
  const server = require('./server');

  process.on('disconnect', () => {
    console.log(`${process.pid} disconnect received, shutting down`);
    if (server.listening) server.close();
  });

  process.send('Hello');
}

if (isMaster) {
  const workers = [];
  for (let i = 0; i < 2; i += 1) {
    console.log('Forking worker', i);
    workers.push(createWorker(i));
  }

  process.once('SIGTERM', () => {
    console.log('Master received SIGTERM');
    workers.forEach(worker => worker.kill());
    console.log('All workers disconnected.');
    process.exit(0);
  });
}
