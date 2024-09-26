import * as TE from 'fp-ts/TaskEither';

export async function timeout(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const timeoutTE = (ms: number) => TE.fromTask(async () => timeout(ms));
