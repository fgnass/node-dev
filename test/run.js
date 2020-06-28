var tap = require('tap');

var run = require('./utils/run');

tap.test('should restart the server', function (t) {
  run('server.js', t.end.bind(t));
});

tap.test('should restart the cluster', function (t) {
  run('cluster.js', t.end.bind(t));
});

tap.test('should support vm functions', function (t) {
  run('vmtest.js', t.end.bind(t));
});

tap.test('should support vm functions with missing file argument', function (t) {
  run('vmtest.js nofile', t.end.bind(t));
});

tap.test('should support coffeescript', function (t) {
  run('server.coffee', t.end.bind(t));
});
