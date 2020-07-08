var util = require('util');
var fmt = require('dateformat');

var colors = {
  info: '36',
  error: '31;1',
  warn: '33'
};

function noop(s) { return s; }

function colorFactory(enableColor) {
  return enableColor ? function (s, c) {
    return '\x1B[' + c + 'm' + s + '\x1B[0m';
  } : noop;
}

/**
 * Logs a message to the console. The level is displayed in ANSI colors,
 * either bright red in case of an error or green otherwise.
 */
module.exports = function ({ noColor, timestamp }) {
  var enableColor = !(noColor || !process.stdout.isTTY);
  var color = colorFactory(enableColor);

  function log(msg, level) {
    var ts = timestamp ? color(fmt(new Date(), timestamp), '39') + ' ' : '';
    var c = colors[level.toLowerCase()] || '32';
    var output = '[' + color(level.toUpperCase(), c) + '] ' + ts + msg;
    console.log(output);
    return output;
  }

  log.info = function () {
    return log(util.format.apply(util, arguments), 'info');
  };

  log.warn = function () {
    return log(util.format.apply(util, arguments), 'warn');
  };

  log.error = function () {
    return log(util.format.apply(util, arguments), 'error');
  };

  return log;
};
