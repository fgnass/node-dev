const tap = require('tap');

const { spawn, touchFile } = require('../utils');

tap.test('should handle errors', t => {
  spawn('error.js', out => {
    if (out.match(/ERROR/)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('should handle null errors', t => {
  spawn('error-null.js', out => {
    if (out.match(/ERROR/)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});
