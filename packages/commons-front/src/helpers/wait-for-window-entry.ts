import { waitFor, type WaitForConfig } from '@dashhub/commons';

export async function waitForWindowEntry<
  N extends keyof Window,
  O = Window[ N ],
>(entryNames: Array<N>, config?: WaitForConfig): Promise<O> {
  const tryPickBundle = () => (
    entryNames
      .map(name => window[name])
      .filter(Boolean)[0]
  );

  return waitFor<O>(
    () => {
      const result = tryPickBundle();

      if (!result) {
        throw new Error(`Window entry "${entryNames.join(',')}" not found.`);
      }

      return result;
    },
    config,
  );
}
