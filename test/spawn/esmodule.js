const semver = require('semver');
const tap = require('tap');

const { spawn, touchFile } = require('../utils');

tap.test('Supports ECMAScript modules with experimental-specifier-resolution', t => {
  if (semver.satisfies(process.version, '<12.17')) return t.skip();

  spawn('--experimental-specifier-resolution=node resolution.mjs', out => {
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

tap.test('Supports ECMAScript modules', t => {
  spawn('ecma-script-modules.mjs', out => {
    if (out.match(/touch message.mjs/)) {
      touchFile('message.mjs');
      return out2 => {
        if (out2.match(/Restarting/)) {
          t.match(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});
