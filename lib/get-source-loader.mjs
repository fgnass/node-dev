import { send } from './ipc.mjs';

export async function getSource(url, context, defaultGetSource) {
  send({ required: new URL(url).pathname });
  return defaultGetSource(url, context, defaultGetSource);
}
