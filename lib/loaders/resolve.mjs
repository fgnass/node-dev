import { fileURLToPath } from 'url';
import { send } from './ipc.mjs';

export function resolve(specifier, parentModule, defaultResolve) {
  const resolved = defaultResolve(specifier, parentModule);

  if (parentModule) {
    send({ required: fileURLToPath(resolved.url) });
  }

  return resolved;
}
