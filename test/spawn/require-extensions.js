const tap = require('tap');

const { spawn } = require('../utils');

tap.test('should be resistant to breaking `require.extensions`', t => {
  spawn('modify-extensions.js', out => {
    t.notOk(/TypeError/.test(out));
  });
  setTimeout(t.end.bind(t), 0);
});
