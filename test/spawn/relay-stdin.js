const tap = require('tap');

const { spawn } = require('../utils');

tap.test('should relay stdin', t => {
  spawn('echo.js', out => {
    if (out === 'foo') return { exit: t.end.bind(t) };
  }).stdin.write('foo');
});
