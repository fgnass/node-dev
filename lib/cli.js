const minimist = require('minimist');
const path = require('path');

const { defaultConfig, getConfig } = require('./cfg');

const configKeys = Object.keys(defaultConfig);

function resolvePath(unresolvedPath) {
  return path.resolve(process.cwd(), unresolvedPath);
}

const doubleDash = s => /^--/.test(s);
const dash = s => /^-[^-]*$/.test(s);

function getFirstNonOptionArgIndex(args) {
  for (let i = 2; i < args.length; i += 1) {
    if (!doubleDash(args[i]) && !dash(args[i]) && !dash(args[i - 1] || '')) return i;
  }

  return args.length - 1;
}

function unique(k) {
  const seen = [];
  return o => {
    if (!seen.includes(o[k])) {
      seen.push(o[k]);
      return true;
    }
    return false;
  };
}

module.exports = argv => {
  const unknownArgs = [];

  const scriptIndex = getFirstNonOptionArgIndex(argv);

  const script = argv[scriptIndex];
  const scriptArgs = argv.slice(scriptIndex + 1);
  const devArgs = argv.slice(2, scriptIndex);

  const opts = minimist(devArgs, {
    boolean: ['clear', 'dedupe', 'fork', 'notify', 'poll', 'respawn', 'vm'],
    string: ['graceful_ipc', 'ignore', 'timestamp'],
    default: getConfig(script),
    unknown: arg => {
      const key = Object.keys(minimist([arg]))[1];

      if (!configKeys.includes(key)) {
        unknownArgs.push({ arg, key });
      }
    }
  });

  const nodeArgs = unknownArgs.filter(unique('key')).reduce((out, { arg, key }) => {
    const value = opts[key];

    if (typeof value !== 'boolean' && !arg.includes('=')) {
      if (Array.isArray(value)) {
        value.forEach(v => out.push(arg, v));
      } else {
        out.push(arg, value);
      }
    } else {
      out.push(arg);
    }

    return out;
  }, []);

  unknownArgs.forEach(({ key }) => {
    delete opts[key];
  });

  opts.ignore = [...Array.isArray(opts.ignore) ? opts.ignore : [opts.ignore]].map(resolvePath);

  return {
    script,
    scriptArgs,
    nodeArgs,
    opts
  };
};
