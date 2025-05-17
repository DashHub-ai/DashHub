import * as E from 'fp-ts/lib/Either';
import { extension } from 'mime-types';

import { TaggedError } from '@dashhub/commons';

export function tryDecodeMimeTypeExtension(mimeType: string) {
  const result = extension(mimeType);

  if (!result) {
    throw E.left(new UnknownMimeTypeError({ mimeType }));
  }

  return E.right(result);
}

export class UnknownMimeTypeError extends TaggedError.ofLiteral<{ mimeType: string; }>()('UnknownMimeTypeError') {}
