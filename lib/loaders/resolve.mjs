import { fileURLToPath } from 'url';
import { send } from './ipc.mjs';

export function resolve(specifier, parentModule, defaultResolve) {
  const resolved = defaultResolve(specifier, parentModule);
  const { url } = resolved;
  const required = url.startsWith('file://') ? fileURLToPath(url) : url;

  if (parentModule) send({ required });

  return resolved;
}
