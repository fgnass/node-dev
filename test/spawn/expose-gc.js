const tap = require('tap');

const spawn = require('../utils/spawn');

tap.test('should pass unknown args to node binary', t => {
  spawn('--expose_gc gc.js foo', out => {
    t.equal(out.trim(), 'foo function');
    return { exit: t.end.bind(t) };
  });
});
