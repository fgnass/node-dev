import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { send } from './ipc.mjs';

const require = createRequire(import.meta.url);

const customLoaderUrl = new URL(import.meta.url).searchParams.get('wrap');
const customLoader = customLoaderUrl ? await import(customLoaderUrl) : {};

export const resolve = customLoader.resolve;

export async function load(url, context, defaultLoad) {
  const getPackageType = require('get-package-type');
  const filePath = fileURLToPath(url);

  send({ required: filePath });
  const customLoad = customLoader.load || defaultLoad;
  try {
    return await customLoad(url, context, defaultLoad);
  } catch (err) {
    if (err.code === 'ERR_UNKNOWN_FILE_EXTENSION') {
      return { format: await getPackageType(filePath), source: null };
    }
    throw err;
  }
}

export const globalPreload = customLoader.globalPreload;
