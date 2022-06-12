const tap = require('tap');
const { spawn } = require('../utils');

tap.test('Should suppress experimental warning spam', t => {
  spawn('env.js', out => {
    if (out.match(/ExperimentalWarning/)) return t.fail('Should not log an ExperimentalWarning');

    return {
      exit: t.end.bind(t)
    };
  });
});
