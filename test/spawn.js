const semver = require('semver');
const tap = require('tap');

const spawn = require('./utils/spawn');
const touchFile = require('./utils/touch-file');

tap.test('should pass unknown args to node binary', t => {
  spawn('--expose_gc gc.js foo', out => {
    t.is(out.trim(), 'foo function');
    return { exit: t.end.bind(t) };
  });
});

tap.test('should restart the server twice', t => {
  spawn('server.js', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
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

tap.test('should watch if no such module', t => {
  let passed = false;
  spawn('no-such-module.js', out => {
    if (!passed && out.match(/ERROR/)) {
      passed = true;
      return { exit: t.end.bind(t) };
    }
  });
});

tap.test('should run async code un uncaughtException handlers', t => {
  spawn('uncaught-exception-handler.js', out => {
    if (out.match(/ERROR/)) {
      return out2 => {
        if (out2.match(/async \[?ReferenceError/)) {
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('should ignore caught errors', t => {
  spawn('catch-no-such-module.js', out => {
    t.like(out, /Caught/);
    return { exit: t.end.bind(t) };
  });
});

tap.test('should not show up in argv', t => {
  spawn('argv.js foo', out => {
    const argv = JSON.parse(out.replace(/'/g, '"'));
    t.like(argv[0], /.*?node(js|\.exe)?$/);
    t.is(argv[1], 'argv.js');
    t.is(argv[2], 'foo');
    return { exit: t.end.bind(t) };
  });
});

tap.test('should pass through the exit code', t => {
  spawn('exit.js').on('exit', code => {
    t.is(code, 101);
    t.end();
  });
});

tap.test('should conceal the wrapper', t => {
  // require.main should be main.js not wrap.js!
  spawn('main.js').on('exit', code => {
    t.is(code, 0);
    t.end();
  });
});

tap.test('should relay stdin', t => {
  const p = spawn('echo.js', out => {
    t.is(out, 'foo');
    return { exit: t.end.bind(t) };
  });
  p.stdin.write('foo');
});

tap.test('Restart the cluster', t => {
  spawn('cluster.js', out => {
    if (out.match(/touch message\.js/m)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/m)) {
          return out3 => {
            if (out3.match(/All workers disconnected/m)) {
              let shuttingDown = false;
              return out4 => {
                if (out4.match(/touch message\.js/) && !shuttingDown) {
                  shuttingDown = true;
                  return { exit: t.end.bind(t) };
                }
              };
            }
          };
        }
      };
    }
  });
});

tap.test('should kill the forked processes', t => {
  spawn('pid.js', out => {
    const pid = parseInt(out, 10);
    return {
      exit: () => {
        setTimeout(() => {
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

tap.test('should *not* set NODE_ENV', t => {
  spawn('env.js', out => {
    t.notLike(out, /development/);
    return { exit: t.end.bind(t) };
  });
});

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
          t.like(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
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
          t.like(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
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
          t.like(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('Supports ECMAScript modules', t => {
  spawn('ecma-script-modules.mjs', out => {
    if (out.match(/touch message.mjs/)) {
      touchFile('message.mjs');
      return out2 => {
        if (out2.match(/Restarting/)) {
          t.like(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('Supports ECMAScript modules with experimental-specifier-resolution', t => {
  if (semver.satisfies(process.version, '<12.17')) return t.skip();

  spawn('--experimental-specifier-resolution=node resolution.mjs', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
          t.like(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
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
