import notifier from 'node-notifier';
import { fileURLToPath } from 'url';

const iconLevelPath = level =>
  fileURLToPath(new URL(`../icons/node_${level}.png`, import.meta.url));

// Writes a message to the console and optionally displays a desktop notification.
export default (notifyEnabled, log) => {
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
