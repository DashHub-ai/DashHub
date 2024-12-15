import type { TaskOption } from 'fp-ts/lib/TaskOption';

import * as O from 'fp-ts/Option';

export function selectFile(accept: string): TaskOption<File> {
  return async () =>
    new Promise((resolve) => {
      const input = document.createElement('input');

      input.type = 'file';
      input.accept = accept;

      input.oncancel = () => {
        resolve(O.none);
      };

      input.onchange = () => {
        resolve(O.fromNullable(input.files?.[0]));
      };

      input.click();
    });
}
