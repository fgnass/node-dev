const tap = require('tap');

const { spawn, touchFile } = require('./utils');

const run = (cmd, exit) => {
  return spawn(cmd, out => {
    let touched = false;
    if (!touched && out.match(/touch message\.js/)) {
      touchFile('message.js');
      touched = true;
      return out2 => {
        if (out2.match(/Restarting/)) {
          return { exit };
        }
      };
    }
  });
};

tap.test('Restart the server', t => {
  run('server.js', t.end.bind(t));
});

tap.test('Supports vm functions', t => {
  run('vmtest.js', t.end.bind(t));
});

tap.test('Supports vm functions with missing file argument', t => {
  run('vmtest.js nofile', t.end.bind(t));
});
