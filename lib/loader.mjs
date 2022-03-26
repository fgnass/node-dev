import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { send } from './ipc.mjs';

const require = createRequire(import.meta.url);

export async function load(url, context, defaultLoad) {
  const getPackageType = require('get-package-type');
  const filePath = fileURLToPath(url);

  send({ required: filePath });
  try {
    return await defaultLoad(url, context, defaultLoad);
  } catch (err) {
    if (err.code === 'ERR_UNKNOWN_FILE_EXTENSION') {
      return { format: await getPackageType(filePath), source: null };
    }
    throw err;
  }
}
