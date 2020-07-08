const fs = require('fs');
const path = require('path');

const resolveMain = require('./resolve-main');

const defaultConfig = {
  clear: false,
  dedupe: false,
  deps: 1,
  extensions: {
    coffee: 'coffeescript/register',
    ls: 'LiveScript'
  },
  fork: true,
  graceful_ipc: '',
  ignore: [],
  notify: true,
  poll: false,
  respawn: false,
  timestamp: 'HH:MM:ss',
  vm: true
};

function read(dir) {
  const f = path.resolve(dir, '.node-dev.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f)) : {};
}

function getConfig(script) {
  const main = resolveMain(script);
  const dir = main ? path.dirname(main) : '.';

  return Object.assign(
    defaultConfig,
    read(process.env.HOME || process.env.USERPROFILE),
    read(process.cwd()),
    read(dir)
  );
}

module.exports = {
  defaultConfig,
  getConfig
};
