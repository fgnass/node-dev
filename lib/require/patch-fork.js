const childProcess = require('child_process');
const { relay } = require('../ipc.cjs');

// Overwrite child_process.fork() so that we can hook into forked processes
// too. We also need to relay messages about required files to the parent.
const { fork } = childProcess;
childProcess.fork = (modulePath, args, options) => {
  const child = fork(modulePath, args, options);
  relay(child);
  return child;
};
