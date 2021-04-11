const tap = require('tap');

const spawn = require('../utils/spawn');

tap.test('should ignore caught errors', t => {
  spawn('catch-no-such-module.js', out => {
    t.match(out, /Caught/);
    return { exit: t.end.bind(t) };
  });
});
