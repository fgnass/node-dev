var tap = require('tap');

var cfg = require('../lib/cfg.js')();
var logFactory = require('../lib/log.js');
var log = logFactory(cfg);

tap.test('log.info', function (t) {
  var out = log.info('hello');
  t.like(out, /\[INFO\] \d{2}:\d{2}:\d{2} hello/);
  t.done();
});

tap.test('log.warn', function (t) {
  var out = log.warn('a warning');
  t.like(out, /\[WARN\] \d{2}:\d{2}:\d{2} a warning/);
  t.done();
});

tap.test('log.error', function (t) {
  var out = log.error('an error');
  t.like(out, /\[ERROR\] \d{2}:\d{2}:\d{2} an error/);
  t.done();
});

tap.test('Disable the timestmap', function (t) {
  var noTsCfg = Object.assign({}, cfg, { timestamp: false });
  var noTsLog = logFactory(noTsCfg);
  var out = noTsLog.info('no timestamp');
  t.like(out, /\[INFO\] no timestamp/);
  t.done();
});
