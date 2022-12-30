const { fork } = require('child_process');
const filewatcher = require('filewatcher');
const { join } = require('path');
const semver = require('semver');
const { pathToFileURL } = require('url');

const { clearFactory } = require('./clear');
const { configureDeps, configureIgnore } = require('./ignore');
const ipc = require('./ipc');
const localPath = require('./local-path');
const logFactory = require('./log');
const notifyFactory = require('./notify');
const resolveMain = require('./resolve-main');

module.exports = function (
  script,
  scriptArgs,
  nodeArgs,
  {
    clear,
    debounce,
    dedupe,
    deps,
    graceful_ipc: gracefulIPC,
    ignore,
    interval,
    notify: notifyEnabled,
    poll: forcePolling,
    respawn,
    timestamp
  }
) {
  if (!script) {
    console.log('Usage: node-dev [options] script [arguments]\n');
    process.exit(1);
  }

  if (typeof script !== 'string' || script.length === 0) {
    throw new TypeError('`script` must be a string');
  }

  if (!Array.isArray(scriptArgs)) {
    throw new TypeError('`scriptArgs` must be an array');
  }

  if (!Array.isArray(nodeArgs)) {
    throw new TypeError('`nodeArgs` must be an array');
  }

  const clearOutput = clearFactory(clear);

  const log = logFactory({ timestamp });
  const notify = notifyFactory(notifyEnabled, log);

  const isIgnored = configureIgnore(ignore);
  const isTooDeep = configureDeps(deps);

  // Run ./dedupe.js as preload script
  if (dedupe) process.env.NODE_DEV_PRELOAD = localPath('dedupe');

  const watcher = filewatcher({ debounce, forcePolling, interval });
  let isPaused = false;

  // The child_process
  let child;

  watcher.on('change', file => {
    clearOutput();
    notify('Restarting', `${file} has been modified`);
    watcher.removeAll();
    isPaused = true;
    if (child) {
      // Child is still running, restart upon exit
      child.on('exit', start);
      stop();
    } else {
      // Child is already stopped, probably due to a previous error
      start();
    }
  });

  watcher.on('fallback', limit => {
    log.warn('node-dev ran out of file handles after watching %s files.', limit);
    log.warn('Falling back to polling which uses more CPU.');
    log.info('Run ulimit -n 10000 to increase the file descriptor limit.');
    if (deps) log.info('... or add `--deps=0` to use fewer file handles.');
  });

  /**
   * Run the wrapped script.
   */
  function start() {
    isPaused = false;

    const args = nodeArgs.slice();

    args.push(`--require=${resolveMain(localPath('wrap'))}`);

    const loaderName = semver.satisfies(process.version, '>=16.12.0') ? 'load' : 'get-format';

    const loaderURL = pathToFileURL(resolveMain(localPath(join('loaders', `${loaderName}.mjs`))));

    args.push(`--experimental-loader=${loaderURL.href}`);

    child = fork(script, scriptArgs, {
      cwd: process.cwd(),
      env: process.env,
      execArgv: args
    });

    if (respawn) {
      child.respawn = true;
    }

    child.once('exit', code => {
      if (!child.respawn) process.exit(code);
      child.removeAllListeners();
      child = undefined;
    });

    // Listen for `required` messages and watch the required file.
    ipc.on(child, 'required', ({ required }) => {
      if (!isPaused && !isIgnored(required) && !isTooDeep(required)) watcher.add(required);
    });

    // Upon errors, display a notification and tell the child to exit.
    ipc.on(child, 'error', ({ error, message, willTerminate }) => {
      notify(error, message, 'error');
      stop(willTerminate);
    });
  }

  function stop(willTerminate) {
    child.respawn = true;
    if (!willTerminate) {
      if (gracefulIPC) {
        log.info('Sending IPC: ' + JSON.stringify(gracefulIPC));
        child.send(gracefulIPC);
      } else {
        child.kill('SIGTERM');
      }
    }
  }

  // Relay SIGTERM
  process.on('SIGTERM', () => {
    if (child && child.connected) {
      if (gracefulIPC) {
        log.info('Sending IPC: ' + JSON.stringify(gracefulIPC));
        child.send(gracefulIPC);
      } else {
        child.kill('SIGTERM');
      }
    }

    process.exit(0);
  });

  clearOutput();
  start();
};
