const tap = require('tap');

const spawn = require('../utils/spawn');

tap.test('should watch if no such module', t => {
  let passed = false;
  spawn('no-such-module.js', out => {
    if (!passed && out.match(/ERROR/)) {
      passed = true;
      return { exit: t.end.bind(t) };
    }
  });
});
