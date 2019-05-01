var util = require('util');
var fmt = require('dateformat');

var colors = {
  info: '36',
  error: '31;1',
  warn: '33'
};

/**
 * Logs a message to the console. The level is displayed in ANSI colors,
 * either bright red in case of an error or green otherwise.
 */
module.exports = function (cfg) {
  function color(s, c) {
    if (process.stdout.isTTY) {
      return '\x1B[' + c + 'm' + s + '\x1B[0m';
    }
    return s;
  }

  function log(msg, level) {
    if (cfg.timestamp) msg = color(fmt(new Date(), cfg.timestamp), '39') + ' ' + msg;
    var c = colors[level.toLowerCase()] || '32';
    var output = '[' + color(level.toUpperCase(), c) + '] ' + msg;
    console.log(output);
    return output
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
