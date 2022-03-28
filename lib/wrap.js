const { dirname, extname } = require('path');
const childProcess = require('child_process');
const { sync: resolve } = require('resolve');
const { isMainThread } = require('worker_threads');

const { getConfig } = require('./cfg');
const hook = require('./hook');
const { relay, send } = require('./ipc');
const resolveMain = require('./resolve-main');
const suppressExperimentalWarnings = require('./suppress-experimental-warnings');

// Experimental warnings need to be suppressed in worker threads as well, since
// their process inherits the Node arguments from the main thread.
suppressExperimentalWarnings(process);

// When using worker threads, each thread appears to require this file through
// the shared Node arguments (--require), so filter them out here and only run
// on the main thread.
if (!isMainThread) return;

const script = process.argv[1];
const { extensions, fork, vm } = getConfig(script);

if (process.env.NODE_DEV_PRELOAD) {
  require(process.env.NODE_DEV_PRELOAD);
}

// We want to exit on SIGTERM, but defer to existing SIGTERM handlers.
process.once('SIGTERM', () => process.listenerCount('SIGTERM') || process.exit(0));

if (fork) {
  // Overwrite child_process.fork() so that we can hook into forked processes
  // too. We also need to relay messages about required files to the parent.
  const originalFork = childProcess.fork;
  childProcess.fork = (modulePath, args, options) => {
    const child = originalFork(modulePath, args, options);
    relay(child);
    return child;
  };
}

// Error handler that displays a notification and logs the stack to stderr:
process.on('uncaughtException', err => {
  // Sometimes uncaught exceptions are not errors
  const { message, name, stack } =
    err instanceof Error ? err : new Error(`uncaughtException ${err}`);

  console.error(stack);

  // If there's a custom uncaughtException handler expect it to terminate
  // the process.
  const willTerminate = process.listenerCount('uncaughtException') > 1;

  send({ error: name, message, willTerminate });
});

// Hook into require() and notify the parent process about required files
hook(vm, required => send({ required }));

// Check if a module is registered for this extension
const main = resolveMain(script);
const ext = extname(main).slice(1);
const mod = extensions[ext];
const basedir = dirname(main);

// Support extensions where 'require' returns a function that accepts options
if (typeof mod === 'object' && mod.name) {
  const fn = require(resolve(mod.name, { basedir }));
  if (typeof fn === 'function' && mod.options) {
    // require returned a function, call it with options
    fn(mod.options);
  }
} else if (typeof mod === 'string') {
  require(resolve(mod, { basedir }));
}
