import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { send } from './ipc.mjs';

const require = createRequire(import.meta.url);

export async function getFormat(url, context, defaultGetFormat) {
  const required = url.startsWith('file://') ? fileURLToPath(url) : url;

  send({ required });

  try {
    return await defaultGetFormat(url, context, defaultGetFormat);
  } catch (error) {
    if (error.code !== 'ERR_UNKNOWN_FILE_EXTENSION') throw error;
    return require('get-package-type')(required).then(format => {
      if (!['builtin', 'commonjs'].includes(format)) throw error;
      return { format };
    });
  }
}
