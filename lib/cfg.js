const { existsSync, readFileSync } = require('fs');
const { dirname, resolve } = require('path');

const resolveMain = require('./resolve-main');

const defaultConfig = {
  clear: false,
  debounce: 10,
  dedupe: false,
  deps: 1,
  extensions: {
    coffee: 'coffeescript/register',
    ls: 'LiveScript',
    ts: 'ts-node/register'
  },
  fork: true,
  graceful_ipc: '',
  ignore: [],
  interval: 1000,
  notify: true,
  poll: false,
  respawn: false,
  timestamp: 'HH:MM:ss',
  vm: true
};

function read(dir) {
  const f = resolve(dir, '.node-dev.json');
  return existsSync(f) ? JSON.parse(readFileSync(f)) : {};
}

function getConfig(script) {
  const main = resolveMain(script);
  const dir = main ? dirname(main) : '.';

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
