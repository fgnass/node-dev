const tap = require('tap');

const spawn = require('../utils/spawn');
const touchFile = require('../utils/touch-file');

const { control } = require('../../lib/clear');

const reClear = new RegExp(control);

tap.test('--clear', t => {
  spawn('--clear server.js', out => {
    if (reClear.test(out)) {
      return out2 => {
        if (out2.match(/touch message.js/)) {
          touchFile('message.js');
          return out3 => {
            if (out3.match(/Restarting/)) {
              return { exit: t.end.bind(t) };
            }
          };
        }
      };
    }
  });
});
