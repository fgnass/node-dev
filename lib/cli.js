const minimist = require('minimist');

function getFirstNonOptionArgIndex(args) {
  for (let i = 2; i < args.length; i += 1) {
    if (args[i][0] != '-') return i;
  }
  return args.length;
}

function removeValueArgs(args, names) {
  let i = 0;
  let removed = [];
  while (i < args.length) {
    if (names.includes(args[i])) {
      removed = removed.concat(args.splice(i, 2));
    } else {
      i += 1;
    }
  }
  return removed;
}

module.exports = function (argv) {
  const nodeArgs = removeValueArgs(argv, ['-r', '--require']);

  const scriptIndex = getFirstNonOptionArgIndex(argv);
  const script = argv[scriptIndex];
  const scriptArgs = argv.slice(scriptIndex + 1);
  const devArgs = argv.slice(2, scriptIndex);

  const opts = minimist(devArgs, {
    boolean: ['all-deps', 'deps', 'dedupe', 'poll', 'respawn', 'notify'],
    string: ['graceful_ipc'],
    default: { deps: true, notify: true, graceful_ipc: '' },
    unknown: function (arg) {
      nodeArgs.push(arg);
    }
  });

  return {
    script,
    scriptArgs,
    nodeArgs,
    opts
  };
};
