const tap = require('tap');

const { spawn } = require('../utils');

tap.test('should pass unknown args to node binary', t => {
  spawn('--expose_gc gc.js foo', out => {
    if (out.trim() === 'foo function') return { exit: t.end.bind(t) };
  });
});
