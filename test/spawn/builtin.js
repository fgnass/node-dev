const tap = require('tap');

const { spawn } = require('../utils');

tap.test('can import builtin modules', t => {
  spawn('builtin.mjs', out => {
    if (out.match(/^hello[/\\]world/)) return { exit: t.end.bind(t) };
  });
});
