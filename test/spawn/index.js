const tap = require('tap');

const spawn = require('../utils/spawn');
const touchFile = require('../utils/touch-file');

require('./argv');
require('./caught');
require('./clear');
require('./cluster');
require('./conceal');
require('./errors');
require('./esmodule');
require('./exit-code');
require('./expose-gc');
require('./kill-fork');
require('./no-such-module');
require('./node-env');
require('./relay-stdin');
require('./restart-twice');
require('./uncaught');

tap.test('should allow graceful shutdowns', t => {
  if (process.platform === 'win32') {
    t.pass('should allow graceful shutdowns', { skip: 'Signals are not supported on Windows' });
    t.end();
  } else {
    spawn('server.js', out => {
      if (out.match(/touch message.js/)) {
        touchFile('message.js');
        return out2 => {
          if (out2.match(/exit/)) {
            return { exit: t.end.bind(t) };
          }
        };
      }
    });
  }
});

tap.test('should send IPC message when configured', t => {
  spawn('--graceful_ipc=node-dev:restart ipc-server.js', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message.js');
      let shuttingDown = false;
      return out2 => {
        if (out2.match(/IPC received/) && !shuttingDown) {
          shuttingDown = true;
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('should be resistant to breaking `require.extensions`', t => {
  spawn('modify-extensions.js', out => {
    t.notOk(/TypeError/.test(out));
  });
  setTimeout(t.end.bind(t), 0);
});

tap.test('Logs timestamp by default', t => {
  spawn('server.js', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
          t.match(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('Supports require from the command-line (ts-node/register)', t => {
  spawn('--require=ts-node/register typescript/index.ts', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
          t.match(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('Uses ts-node/register for .ts files through config file (also the default)', t => {
  spawn('typescript/index.ts', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
          t.match(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('Supports --inspect', t => {
  spawn('--inspect server.js', out => {
    if (out.match(/Debugger listening on/)) {
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
