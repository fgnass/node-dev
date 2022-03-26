import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { send } from './ipc.mjs';

const require = createRequire(import.meta.url);

const customLoaderUrl = new URL(import.meta.url).searchParams.get('wrap');
const customLoader = customLoaderUrl ? await import(customLoaderUrl) : {};

export const resolve = customLoader.resolve;

export async function getFormat(url, context, defaultGetFormat) {
  const getPackageType = require('get-package-type');
  const filePath = fileURLToPath(url);

  send({ required: filePath });
  const customGetFormat = customLoader.load || defaultGetFormat;
  try {
    return await customGetFormat(url, context, defaultGetFormat);
  } catch (err) {
    if (err.code === 'ERR_UNKNOWN_FILE_EXTENSION') {
      return { format: await getPackageType(filePath) };
    }
    throw err;
  }
}

export const getSource = customLoader.getSource;

export const transformSource = customLoader.transformSource;
export const getGlobalPreloadCode = customLoader.getGlobalPreloadCode;
