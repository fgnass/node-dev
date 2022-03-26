const tap = require('tap');

const { spawn } = require('../utils');

tap.test('should be resistant to breaking `require.extensions`', t => {
  spawn('modify-extensions.js', out => {
    t.notOk(/TypeError/.test(out));
    if (out.match('extensions modified')) return { exit: t.end.bind(t) };
  });
});
