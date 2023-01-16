const { Module } = require('module');
const { dirname, extname } = require('path');
const { isMainThread, getEnvironmentData, setEnvironmentData } = require('worker_threads');
const { getConfig } = require('../cfg.cjs');
const { send } = require('../ipc.cjs');

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

if (isMainThread) {
  // When using worker threads, each thread inherits execArgv and re-evaulates
  // --require scripts. Worker threads do not inherit argv, so we copy argv[1]
  // to the environment for those processes to use.
  setEnvironmentData('NODE_DEV_SCRIPT', require.resolve(process.argv[1]));
}

const script = getEnvironmentData('NODE_DEV_SCRIPT');

// Check if a module is registered for this extension
const ext = extname(script).slice(1);
const { extensions } = getConfig(script);

const register = extensions[ext];

// Support extensions where 'require' returns a function that accepts options
if (typeof register === 'object' && register.name) {
  const fn = require(require.resolve(register.name, { paths: [dirname(script)] }));
  if (typeof fn === 'function' && register.options) {
    // require returned a function, call it with options
    fn(register.options);
  }
} else if (typeof register === 'string') {
  require(require.resolve(register, { paths: [dirname(script)] }));
}

// Hook into Node's `require(...)`
updateHooks();

/**
 * (Re-)install hooks for all registered file extensions.
 */
function updateHooks() {
  Object.keys(Module._extensions).forEach(ext => {
    const fn = Module._extensions[ext];
    if (typeof fn === 'function' && fn.name !== 'nodeDevHook') {
      Module._extensions[ext] = createHook(fn);
    }
  });
}

/**
 * Returns a function that can be put into `require.extensions` in order to
 * invoke the callback when a module is required for the first time.
 */
function createHook(handler) {
  return function nodeDevHook(module, filename) {
    if (!module.loaded) send({ required: module.filename });

    // Invoke the original handler
    handler(module, filename);

    // Make sure the module did not hijack the handler
    updateHooks();
  };
}
