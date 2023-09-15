import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { sendPort } from './ipc.mjs';

const require = createRequire(import.meta.url);

// Port used for communication between the loader and ESM modules
// https://nodejs.org/api/esm.html#globalpreload
let port;

export async function load(url, context, defaultLoad) {
  const required = url.startsWith('file://') ? fileURLToPath(url) : url;

  sendPort(port, { required });

  try {
    return await defaultLoad(url, context, defaultLoad);
  } catch (error) {
    if (error.code !== 'ERR_UNKNOWN_FILE_EXTENSION') throw error;
    return require('get-package-type')(required).then(format => {
      if (!['builtin', 'commonjs'].includes(format)) throw error;
      return { format };
    });
  }
}

export const globalPreload = (context) => {
  // Store port
  port = context.port;

  // Inject code to forward loader events to the parent
  return `
port.on('message', (m) => {
  if (process.connected) process.send(m);
});
  `;
};
