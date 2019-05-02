var tap = require('tap');
var run = require('./utils/run');
var spawn = require('./utils/spawn');
var touchFile = require('./utils/touch-file');

// Tests

tap.test('node-dev using spawn', function (t1) {
  t1.test('should pass unknown args to node binary', function (t) {
    spawn('--expose_gc gc.js foo', function (out) {
      t.is(out.trim(), 'foo function');
      return { exit: t.end.bind(t) };
    });
  });

  t1.test('should restart the server twice', function (t) {
    spawn('server.js', function (out) {
      if (out.match(/touch message.js/)) {
        touchFile();
        return function (out2) {
          if (out2.match(/Restarting/)) {
            touchFile();
            return function (out3) {
              if (out3.match(/Restarting/)) {
                return { exit: t.end.bind(t) };
              }
            };
          }
        };
      }
    });
  });

  t1.test('should handle errors', function (t) {
    spawn('error.js', function (out) {
      if (out.match(/ERROR/)) {
        touchFile();
        return function (out2) {
          if (out2.match(/Restarting/)) {
            return { exit: t.end.bind(t) };
          }
        };
      }
    });
  });

  t1.test('should watch if no such module', function (t) {
    spawn('noSuchModule.js', function (out) {
      t.like(out, /ERROR/);
      return { exit: t.end.bind(t) };
    });
  });

  t1.test('should run async code un uncaughtException handlers', function (t) {
    spawn('uncaughtExceptionHandler.js', function (out) {
      if (out.match(/ERROR/)) {
        return function (out2) {
          if (out2.match(/async \[?ReferenceError/)) {
            return { exit: t.end.bind(t) };
          }
        };
      }
    });
  });

  t1.test('should ignore caught errors', function (t) {
    spawn('catchNoSuchModule.js', function (out) {
      t.like(out, /Caught/);
      return { exit: t.end.bind(t) };
    });
  });

  t1.test('should not show up in argv', function (t) {
    spawn('argv.js foo', function (out) {
      var argv = JSON.parse(out.replace(/'/g, '"'));
      t.like(argv[0], /.*?node(js|\.exe)?$/);
      t.is(argv[1], 'argv.js');
      t.is(argv[2], 'foo');
      return { exit: t.end.bind(t) };
    });
  });

  t1.test('should pass through the exit code', function (t) {
    spawn('exit.js').on('exit', function (code) {
      t.is(code, 101);
      t.end();
    });
  });

  t1.test('should conceal the wrapper', function (t) {
    // require.main should be main.js not wrap.js!
    spawn('main.js').on('exit', function (code) {
      t.is(code, 0);
      t.end();
    });
  });

  t1.test('should relay stdin', function (t) {
    var p = spawn('echo.js', function (out) {
      t.is(out, 'foo');
      return { exit: t.end.bind(t) };
    });
    p.stdin.write('foo');
  });

  t1.test('should kill the forked processes', function (t) {
    spawn('pid.js', function (out) {
      var pid = parseInt(out, 10);
      return {
        exit: function () {
          setTimeout(function () {
            try {
              process.kill(pid);
              t.fail('child must no longer run');
            } catch (e) {
              t.end();
            }
          }, 500);
        }
      };
    });
  });

  t1.test('should set NODE_ENV', function (t) {
    spawn('env.js', function (out) {
      t.like(out, /development/);
      return { exit: t.end.bind(t) };
    });
  });

  t1.test('should allow graceful shutdowns', function (t) {
    if (process.platform === 'win32') {
      t.pass('should allow graceful shutdowns', { skip: 'Signals are not supported on Windows' });
      t.end();
    } else {
      spawn('server.js', function (out) {
        if (out.match(/touch message.js/)) {
          touchFile();
          return function (out2) {
            if (out2.match(/exit/)) {
              return { exit: t.end.bind(t) };
            }
          };
        }
      });
    }
  });

  t1.test('should send IPC message when configured', function (t) {
    spawn('--graceful_ipc=node-dev:restart ipc-server.js', function (out) {
      if (out.match(/touch message.js/)) {
        touchFile();
        return function (out2) {
          if (out2.match(/IPC received/)) {
            return { exit: t.end.bind(t) };
          }
        };
      }
    });
  });

  t1.test('should be resistant to breaking `require.extensions`', function (t) {
    spawn('modify-extensions.js', function (out) {
      t.notOk(/TypeError/.test(out));
    });
    setTimeout(t.end.bind(t), 0);
  });

  t1.test('Logs timestamp by default', function (t) {
    spawn('server.js', function (out) {
      if (out.match(/touch message.js/)) {
        touchFile();
        return function (out2) {
          t.like(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        };
      }
    });
  });

  t1.end();
});

tap.test('node-dev using run', function (t1) {
  t1.test('should restart the server', function (t) {
    run('server.js', t.end.bind(t));
  });

  t1.test('should restart the cluster', function (t) {
    run('cluster.js', t.end.bind(t));
  });

  t1.test('should support vm functions', function (t) {
    run('vmtest.js', t.end.bind(t));
  });

  t1.test('should support vm functions with missing file argument', function (t) {
    run('vmtest.js nofile', t.end.bind(t));
  });

  t1.test('should support coffeescript', function (t) {
    run('server.coffee', t.end.bind(t));
  });

  t1.end();
});
