const { format } = require('util');
const dateformat = require('dateformat');

const colors = {
  error: '31;1',
  info: '36',
  warn: '33'
};

const LOG_LEVELS = Object.keys(colors);

const noop = s => s;
const colorOutput = (s, c) => '\x1B[' + c + 'm' + s + '\x1B[0m';

/**
 * Logs a message to the console. The level is displayed in ANSI colors:
 * errors are bright red, warnings are yellow, and info is cyan.
 */
module.exports = ({ noColor, timestamp }) => {
  const enableColor = !(noColor || !process.stdout.isTTY);
  const color = enableColor ? colorOutput : noop;

  const log = (msg, level) => {
    const ts = timestamp ? color(dateformat(new Date(), timestamp), '39') + ' ' : '';
    const c = colors[level.toLowerCase()] || '32';
    const output = `[${color(level.toUpperCase(), c)}] ${ts}${msg}`;
    console.log(output);
    return output;
  };

  const logFactory = level =>
    function () {
      return log(format.apply(null, arguments), level);
    };

  return LOG_LEVELS.reduce((log, level) => {
    log[level] = logFactory(level);
    return log;
  }, {});
};
