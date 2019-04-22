var fs = require('fs');
var path = require('path');

function read(dir) {
  var f = path.resolve(dir, '.node-dev.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f)) : {};
}

function resolvePath(unresolvedPath) {
  return path.resolve(process.cwd(), unresolvedPath);
}

module.exports = function (main, opts) {

  var dir = main ? path.dirname(main) : '.';
  var c = Object.assign(read(process.cwd()), read(dir));

  /* eslint-disable no-proto */
  c.__proto__ = read(process.env.HOME || process.env.USERPROFILE);

  // Truthy == --all-deps, false: one level of deps
  if (typeof c.deps !== 'number') c.deps = c.deps ? -1 : 1;

  if (opts) {
    // Overwrite with CLI opts ...
    if (opts.allDeps) c.deps = -1;
    if (!opts.deps) c.deps = 0;
    if (opts.dedupe) c.dedupe = true;
    if (opts.graceful_ipc) c.graceful_ipc = opts.graceful_ipc;
    if (opts.respawn) c.respawn = true;
    if (opts.notify === false) c.notify = false;
  }

  var ignore = (c.ignore || []).map(resolvePath);

  return {
    vm: c.vm !== false,
    fork: c.fork !== false,
    notify: c.notify !== false,
    deps: c.deps,
    timestamp: c.timestamp || (c.timestamp !== false && 'HH:MM:ss'),
    clear: !!c.clear,
    dedupe: !!c.dedupe,
    graceful_ipc: c.graceful_ipc,
    ms_win: process.platform === "win32",
    ignore: ignore,
    respawn: c.respawn || false,
    extensions: c.extensions || {
      coffee: 'coffeescript/register',
      ls: 'LiveScript'
    }
  };
};
