const { register } = require('node:module');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const semver = require('semver');

const { send } = require('./ipc');
const localPath = require('./local-path');
const resolveMain = require('./resolve-main');

exports.registerLoader = () => {
  if (!semver.satisfies(process.version, '>=20.6.0')) return;

  const loaderURL = pathToFileURL(resolveMain(localPath(join('loaders', 'load.mjs'))));

  const { port1, port2 } = new MessageChannel();
  port1.on('message', ({ required } = {}) => {
    send({ required });
  });

  register(loaderURL.href, {
    parentURL: loaderURL.href,
    data: { port: port2 },
    transferList: [port2]
  });

  return port1;
};
