const { once } = require('events');
const { Worker } = require('worker_threads');

const logFactory = require('./log.cjs');

const cmd = 'NODE_DEV';
const log = logFactory({});
let nodeDevPort;

exports.on = (src, prop, cb) => {
  src.on('internalMessage', m => {
    if (m.cmd === cmd && prop in m) cb(m);
  });
};

exports.relay = src => {
  if (src instanceof Worker) {
    // create a separate message channel for node-dev
    const { port1, port2 } = new MessageChannel();
    port1.unref();
    port1.on('message', exports.send);
    src.postMessage({ cmd, port: port2 }, [port2]);
  } else {
    src.on('internalMessage', m => {
      if (process.connected && m.cmd === cmd) process.send(m);
    });
  }
};

exports.send = m => {
  if (process.connected) {
    process.send({ ...m, cmd });
  } else if (nodeDevPort) {
    // this has doesn't seem to have a race condition in testing
    // but just in case, the log statement below should notify of it
    nodeDevPort.postMessage({ ...m, cmd });
  } else {
    log.warn(
      `node-dev: The module ${m.required} was imported from an orphaned child process or worker thread`
    );
  }
};

exports.receiveMessagePort = async src => {
  // the first message received by this thread should contain the parent port
  const [m] = await once(src, 'message');
  if (m && m.cmd === cmd) {
    nodeDevPort = m.port;
  } else {
    log.warn('node-dev: unexpected message on the parentPort', m);
  }
};
