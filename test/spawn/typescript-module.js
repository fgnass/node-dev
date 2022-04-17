const tap = require('tap');

const { spawn } = require('../utils');

tap.test(
  'Gives ERR_UNKNOWN_FILE_EXTENSION when loading typescript files and package type is "module"',
  t => {
    spawn('typescript-module/index.ts', out => {
      if (out.match(/ERR_UNKNOWN_FILE_EXTENSION/)) {
        return { exit: t.end.bind(t) };
      }
    });
  }
);
