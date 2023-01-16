import tap from 'tap';
import { spawn } from '../utils.js';

tap.test('Should suppress experimental warning spam', t => {
  spawn('env.js', out => {
    if (out.match(/ExperimentalWarning/)) return t.fail('Should not log an ExperimentalWarning');

    return {
      exit: t.end.bind(t)
    };
  });
});
