const tap = require('tap');

const { spawn } = require('../utils');

tap.test('should pass options to extensions according to .node-dev.json', t => {
  spawn('extension-options', out => {
    if (out.match(/\{ test: true \}/)) return { exit: t.end.bind(t) };
  });
});
