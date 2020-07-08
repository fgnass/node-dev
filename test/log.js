const tap = require('tap');

const { defaultConfig } = require('../lib/cfg');
const logFactory = require('../lib/log');

const noColorCfg = { ...defaultConfig, noColor: true };

tap.test('log.info', function (t) {
  const log = logFactory(noColorCfg);
  t.like(log.info('hello'), /\[INFO\] \d{2}:\d{2}:\d{2} hello/);
  t.done();
});

tap.test('log.warn', function (t) {
  const log = logFactory(noColorCfg);
  t.like(log.warn('a warning'), /\[WARN\] \d{2}:\d{2}:\d{2} a warning/);
  t.done();
});

tap.test('log.error', function (t) {
  const log = logFactory(noColorCfg);
  t.like(log.error('an error'), /\[ERROR\] \d{2}:\d{2}:\d{2} an error/);
  t.done();
});

tap.test('Disable the timestamp', function (t) {
  const log = logFactory({ ...noColorCfg, timestamp: false });
  t.like(log.info('no timestamp'), /\[INFO\] no timestamp/);
  t.done();
});

tap.test('Custom timestamp', function (t) {
  const log = logFactory({ ...noColorCfg, timestamp: 'yyyy-mm-dd HH:MM:ss' });
  t.like(log.error('an error'), /\[ERROR\] \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} an error/);
  t.done();
});
