const tap = require('tap');

const { spawn, touchFile } = require('../utils');

tap.test('Uses ts-node/register for .ts files through config file (also the default)', t => {
  spawn('typescript/index.ts', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
          t.match(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});
