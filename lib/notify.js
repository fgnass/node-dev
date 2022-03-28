const notifier = require('node-notifier');

const iconLevelPath = level => require.resolve(`../icons/node_${level}.png`);

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
