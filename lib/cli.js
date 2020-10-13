const minimist = require('minimist');
const path = require('path');

const { defaultConfig, getConfig } = require('./cfg');

const configKeys = Object.keys(defaultConfig);

function resolvePath(unresolvedPath) {
  return path.resolve(process.cwd(), unresolvedPath);
}

function getFirstNonOptionArgIndex(args) {
  for (let i = 2; i < args.length; i += 1) {
    if (args[i][0] != '-') return i;
  }

  return args.length;
}

module.exports = argv => {
  const nodeArgs = [];

  const scriptIndex = getFirstNonOptionArgIndex(argv);
  const script = argv[scriptIndex];
  const scriptArgs = argv.slice(scriptIndex + 1);
  const devArgs = argv.slice(2, scriptIndex);

  const opts = minimist(devArgs, {
    boolean: ['clear', 'dedupe', 'fork', 'notify', 'poll', 'respawn', 'vm'],
    string: ['graceful_ipc', 'ignore', 'timestamp'],
    default: getConfig(script),
    unknown: function (arg) {
      const argKeys = Object.keys(minimist([arg]));

      if (configKeys.some(k => argKeys.includes(k))) {
        return true;
      }

      nodeArgs.push(arg);
    }
  });

  opts.ignore = [...Array.isArray(opts.ignore) ? opts.ignore : [opts.ignore]].map(resolvePath);

  return {
    script,
    scriptArgs,
    nodeArgs,
    opts
  };
};
