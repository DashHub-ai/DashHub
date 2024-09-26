/**
 * Create a new error with a message and optional metadata.
 */
export function panicError(message: string) {
  return (meta?: any) =>
    new Error(
      [`PANIC! ${message}`, meta && JSON.stringify(meta, null, 2)].filter(Boolean).join('\n'),
    );
}
