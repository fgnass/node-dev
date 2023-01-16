const workerThreads = require('worker_threads');
const { receiveMessagePort, relay } = require('../ipc.cjs');

const { Worker } = workerThreads;
workerThreads.Worker = class NodeDevWorker extends Worker {
  constructor(...args) {
    super(...args);
    relay(this);
  }
};

if (workerThreads.parentPort) {
  receiveMessagePort(workerThreads.parentPort);
}
