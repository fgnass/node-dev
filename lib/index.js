const fork = require('child_process').fork;
const filewatcher = require('filewatcher');
const path = require('path');

const ipc = require('./ipc');
const logFactory = require('./log');
const notifyFactory = require('./notify');
const resolveMain = require('./resolve-main');

module.exports = function (script, scriptArgs, nodeArgs, {
  clear,
  dedupe,
  deps,
  graceful_ipc: gracefulIPC,
  ignore,
  notify: notifyEnabled,
  poll: forcePolling,
  respawn,
  timestamp
}) {
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

  const log = logFactory({ timestamp });
  const notify = notifyFactory(notifyEnabled, log);

  // The child_process
  let child;

  const wrapper = resolveMain(path.join(__dirname, 'wrap.js'));

  // Run ./dedupe.js as preload script
  if (dedupe) process.env.NODE_DEV_PRELOAD = path.join(__dirname, 'dedupe');

  const watcher = filewatcher({ forcePolling });

  watcher.on('change', function (file) {
    /* eslint-disable no-octal-escape */
    if (clear) process.stdout.write('\033[2J\033[H');
    notify('Restarting', file + ' has been modified');
    watcher.removeAll();
    if (child) {
      // Child is still running, restart upon exit
      child.on('exit', start);
      stop();
    } else {
      // Child is already stopped, probably due to a previous error
      start();
    }
  });

  watcher.on('fallback', function (limit) {
    log.warn('node-dev ran out of file handles after watching %s files.', limit);
    log.warn('Falling back to polling which uses more CPU.');
    log.info('Run ulimit -n 10000 to increase the file descriptor limit.');
    if (deps) log.info('... or add `--deps=0` to use fewer file handles.');
  });

  /**
   * Run the wrapped script.
   */
  function start() {
    const cmd = nodeArgs.concat(wrapper, script, scriptArgs);
    child = fork(cmd[0], cmd.slice(1), {
      cwd: process.cwd(),
      env: process.env
    });

    if (respawn) {
      child.respawn = true;
    }
    child.on('exit', function (code) {
      if (!child.respawn) process.exit(code);
      child = undefined;
    });

    // Listen for `required` messages and watch the required file.
    ipc.on(child, 'required', function (m) {
      const isIgnored = ignore.some(isPrefixOf(m.required));

      if (!isIgnored && (deps === -1 || getLevel(m.required) <= deps)) {
        watcher.add(m.required);
      }
    });

    // Upon errors, display a notification and tell the child to exit.
    ipc.on(child, 'error', function (m) {
      notify(m.error, m.message, 'error');
      stop(m.willTerminate);
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
    child.disconnect();
  }

  // Relay SIGTERM
  process.on('SIGTERM', function () {
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

  start();
};

/**
 * Returns the nesting-level of the given module.
 * Will return 0 for modules from the main package or linked modules,
 * a positive integer otherwise.
 */
function getLevel(mod) {
  const p = getPrefix(mod);
  return p.split('node_modules').length - 1;
}

/**
 * Returns the path up to the last occurence of `node_modules` or an
 * empty string if the path does not contain a node_modules dir.
 */
function getPrefix(mod) {
  const n = 'node_modules';
  const i = mod.lastIndexOf(n);
  return i !== -1 ? mod.slice(0, i + n.length) : '';
}

function isPrefixOf(value) {
  return function (prefix) {
    return value.indexOf(prefix) === 0;
  };
}
