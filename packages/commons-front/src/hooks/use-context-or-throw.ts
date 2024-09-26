import { type Context, useContext } from 'react';

export function useContextOrThrow<D>(context: Context<D>, message: string): NonNullable<D> {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error(message);
  }

  return ctx;
}
