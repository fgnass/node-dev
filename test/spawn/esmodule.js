import tap from 'tap';

import { spawn, touchFile } from '../utils.js';

tap.test('Supports ECMAScript modules with experimental-specifier-resolution', t => {
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

tap.test('Supports ECMAScript module packages', t => {
  spawn('ecma-script-module-package/index.js', out => {
    if (out.match(/touch ecma-script-module-package\/message.js/)) {
      touchFile('ecma-script-module-package/message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
          t.match(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('We can hide the experimental warning by passing --no-warnings', t => {
  spawn('--no-warnings ecma-script-modules.mjs', out => {
    if (out.match(/ExperimentalWarning/)) return t.fail('Should not log an ExperimentalWarning');

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
