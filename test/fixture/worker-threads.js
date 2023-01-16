const { Worker, isMainThread, parentPort } = require('worker_threads');

const createWorker = i => {
  const worker = new Worker(__filename);

  worker.on('message', msg => {
    console.log(`Message from worker ${i}: ${msg}`);
  });

  worker.on('exit', code => {
    console.log(`Worker ${i} exited with code: ${code}`);
  });

  return worker;
};

if (!isMainThread) {
  const server = require('./server');

  parentPort.on('close', () => {
    console.log(`${process.pid} disconnect received, shutting down`);
    if (server.listening) server.close();
  });

  parentPort.postMessage('Hello');
}

if (isMainThread) {
  const workers = [...Array(2).keys()].map(n => {
    console.log('Creating worker thread', n);
    return createWorker(n);
  });

  process.once('SIGTERM', () => {
    console.log('Main thread received SIGTERM');

    Promise.all(workers.map(worker => worker.terminate())).then(() => {
      console.log('All workers disconnected.');
    });
  });
}
