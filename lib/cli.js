const assert = require('assert');
const minimist = require('minimist');
const { resolve } = require('path');

const { getConfig } = require('./cfg');

const arrayify = v => (Array.isArray(v) ? [...v] : [v]);
const argify = key => ({ arg: `--${key}`, key });

const resolvePath = p => resolve(process.cwd(), p);

const nodeAlias = { require: 'r' };
const nodeBoolean = ['expose_gc'];
const nodeOptional = ['inspect', 'inspect-brk'];
const nodeString = ['require'];

const nodeDevBoolean = ['clear', 'dedupe', 'fork', 'notify', 'poll', 'respawn', 'vm'];
const nodeDevNumber = ['debounce', 'deps', 'interval'];
const nodeDevString = ['graceful_ipc', 'ignore', 'timestamp'];

const alias = Object.assign({}, nodeAlias);
const boolean = [...nodeBoolean, ...nodeDevBoolean];
const string = [...nodeString, ...nodeDevString];

const nodeArgsReducer = opts => (out, { arg, key }) => {
  const value = opts[key];

  if (typeof value === 'boolean') {
    value && out.push(arg);
  } else if (typeof value !== 'undefined') {
    arrayify(value).forEach(v => {
      if (arg.includes('=')) {
        out.push(`${arg.split('=')[0]}=${v}`);
      } else {
        out.push(`${arg}=${v}`);
      }
    });
  }

  delete opts[key];

  return out;
};

const nodeOptionalFactory = args => arg => {
  const isNodeOptional = nodeOptional.includes(arg.substring(2));
  if (isNodeOptional) args.push(arg);
  return !isNodeOptional;
};

const unknownFactory = args => arg => {
  const [, key] = Object.keys(minimist([arg]));
  key && !nodeDevNumber.includes(key) && args.push({ arg, key });
};

module.exports = argv => {
  const nodeOptionalArgs = [];
  const args = argv.slice(2).filter(nodeOptionalFactory(nodeOptionalArgs));

  const unknownArgs = [];
  const unknown = unknownFactory(unknownArgs);

  const {
    _: [script, ...scriptArgs]
  } = minimist(args, { alias, boolean, string, unknown });

  assert(script, 'Could not parse command line arguments');

  const opts = minimist(args, { alias, boolean, default: getConfig(script) });

  const nodeArgs = [...nodeBoolean.map(argify), ...nodeString.map(argify), ...unknownArgs]
    .sort((a, b) => a.key - b.key)
    .reduce(nodeArgsReducer(opts), [...nodeOptionalArgs]);

  opts.ignore = arrayify(opts.ignore).map(resolvePath);

  return { nodeArgs, opts, script, scriptArgs };
};
