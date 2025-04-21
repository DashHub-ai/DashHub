export function isDangerousObjectKey(key: string): boolean {
  return ['__proto__', 'constructor', 'prototype'].includes(key);
};
