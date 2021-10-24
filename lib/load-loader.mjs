import { send } from './ipc.js';

export async function load(url, context, defaultLoad) {
  send({ required: new URL(url).pathname });
  return defaultLoad(url, context, defaultLoad);
}
