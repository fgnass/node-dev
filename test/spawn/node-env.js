const tap = require('tap');

const { spawn } = require('../utils');

tap.test('should *not* set NODE_ENV', t => {
  spawn('env.js', out => {
    if (out.startsWith('NODE_ENV:')) {
      t.notMatch(out, /development/);
      return { exit: t.end.bind(t) };
    }
  });
});
