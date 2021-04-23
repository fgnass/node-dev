const tap = require('tap');

const { spawn } = require('../utils');

tap.test('should run async code uncaughtException handlers', t => {
  spawn('uncaught-exception-handler.js', out => {
    if (out.match(/ERROR/)) {
      return out2 => {
        if (out2.match(/async \[?ReferenceError/)) {
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});
