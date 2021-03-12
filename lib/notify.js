const notifier = require('node-notifier');

const localPath = require('./local-path');

const iconLevelPath = level => localPath(`../icons/node_${level}.png`);

/**
 * Displays a desktop notification and writes a message to the console.
 */
module.exports = function (notifyEnabled, log) {
  return (title = 'node-dev', message, level = 'info') => {
    log(`${title}: ${message}`, level);

    if (notifyEnabled) {
      notifier.notify({
        title,
        icon: iconLevelPath(level),
        message
      });
    }
  };
};
