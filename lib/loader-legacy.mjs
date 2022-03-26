import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { send } from './ipc.mjs';

const require = createRequire(import.meta.url);

export async function getFormat(url, context, defaultGetFormat) {
  const getPackageType = require('get-package-type');
  const filePath = fileURLToPath(url);

  send({ required: filePath });
  try {
    return await defaultGetFormat(url, context, defaultGetFormat);
  } catch (err) {
    if (err.code === 'ERR_UNKNOWN_FILE_EXTENSION') {
      return { format: await getPackageType(filePath) };
    }
    throw err;
  }
}
