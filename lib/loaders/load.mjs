import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { send } from './ipc.mjs';

const require = createRequire(import.meta.url);

export async function load(url, context, defaultLoad) {
  const filePath = fileURLToPath(url);

  send({ required: filePath });

  try {
    return await defaultLoad(url, context, defaultLoad);
  } catch (error) {
    if (error.code !== 'ERR_UNKNOWN_FILE_EXTENSION') throw error;
    return require('get-package-type')(filePath).then(format => ({ format, source: null }));
  }
}
