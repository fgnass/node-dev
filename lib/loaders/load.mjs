import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { send } from './ipc.mjs';

const require = createRequire(import.meta.url);

let connectedPort;

export async function initialize({ port } = {}) {
  connectedPort = port;
}

export async function load(url, context, nextLoad) {
  const required = url.startsWith('file://') ? fileURLToPath(url) : url;

  send({ required });
  if (connectedPort) connectedPort.postMessage({ required });

  try {
    return await nextLoad(url, context);
  } catch (error) {
    if (error.code !== 'ERR_UNKNOWN_FILE_EXTENSION') throw error;
    return require('get-package-type')(required).then(format => {
      if (!['builtin', 'commonjs'].includes(format)) throw error;
      return { format };
    });
  }
}
