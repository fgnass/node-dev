import tap from 'tap';

import { defaultConfig } from '../lib/cfg.cjs';
import logFactory from '../lib/log.cjs';

const noColorCfg = { ...defaultConfig, noColor: true };

tap.test('log.info', t => {
  const log = logFactory(noColorCfg);
  t.match(log.info('hello'), /\[INFO\] \d{2}:\d{2}:\d{2} hello/);
  t.end();
});

tap.test('log.warn', t => {
  const log = logFactory(noColorCfg);
  t.match(log.warn('a warning'), /\[WARN\] \d{2}:\d{2}:\d{2} a warning/);
  t.end();
});

tap.test('log.error', t => {
  const log = logFactory(noColorCfg);
  t.match(log.error('an error'), /\[ERROR\] \d{2}:\d{2}:\d{2} an error/);
  t.end();
});

tap.test('Disable the timestamp', t => {
  const log = logFactory({ ...noColorCfg, timestamp: false });
  t.match(log.info('no timestamp'), /\[INFO\] no timestamp/);
  t.end();
});

tap.test('Custom timestamp', t => {
  const log = logFactory({ ...noColorCfg, timestamp: 'yyyy-mm-dd HH:MM:ss' });
  t.match(log.error('an error'), /\[ERROR\] \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} an error/);
  t.end();
});
