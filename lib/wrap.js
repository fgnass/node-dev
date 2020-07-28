const path = require('path');
const childProcess = require('child_process');
const resolve = require('resolve').sync;

const { getConfig } = require('./cfg');
const hook = require('./hook');
const ipc = require('./ipc');
const resolveMain = require('./resolve-main');

// Remove wrap.js from the argv array
process.argv.splice(1, 1);

const script = process.argv[1];
const { extensions, fork, vm } = getConfig(script);

if (process.env.NODE_DEV_PRELOAD) {
  require(process.env.NODE_DEV_PRELOAD);
}

// Listen SIGTERM and exit unless there is another listener
process.on('SIGTERM', function () {
  if (process.listeners('SIGTERM').length === 1) process.exit(0);
});

if (fork) {
  // Overwrite child_process.fork() so that we can hook into forked processes
  // too. We also need to relay messages about required files to the parent.
  const originalFork = childProcess.fork;
  childProcess.fork = function (modulePath, args, options) {
    const child = originalFork(__filename, [modulePath].concat(args), options);
    ipc.relay(child);
    return child;
  };
}

// Error handler that displays a notification and logs the stack to stderr:
process.on('uncaughtException', function (err) {
  // Sometimes uncaught exceptions are not errors
  const { message, name, stack } = err instanceof Error ? err : new Error(`uncaughtException ${err}`);

  console.error(stack);

  // If there's a custom uncaughtException handler expect it to terminate
  // the process.
  const willTerminate = process.listeners('uncaughtException').length > 1;

  ipc.send({ error: name, message, willTerminate });
});

// Hook into require() and notify the parent process about required files
hook(vm, module, function (required) {
  ipc.send({ required });
});

// Check if a module is registered for this extension
const main = resolveMain(script);
const ext = path.extname(main).slice(1);
const mod = extensions[ext];
const basedir = path.dirname(main);

// Support extensions where 'require' returns a function that accepts options
if (typeof mod == 'object' && mod.name) {
  const fn = require(resolve(mod.name, { basedir }));
  if (typeof fn == 'function' && mod.options) {
    // require returned a function, call it with options
    fn(mod.options);
  }
} else if (typeof mod == 'string') {
  require(resolve(mod, { basedir }));
}

// Execute the wrapped script
require(main);
