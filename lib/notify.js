const notifier = require('node-notifier');

const localPath = require('./local-path');

const iconLevelPath = level => localPath(`../icons/node_${level}.png`);

// Writes a message to the console and optionally displays a desktop notification.
module.exports = (notifyEnabled, log) => {
  return (title = 'node-dev', message, level = 'info') => {
    log[level](`${title}: ${message}`);

    if (notifyEnabled) {
      notifier.notify({
        title,
        icon: iconLevelPath(level),
        message
      });
    }
  };
};
