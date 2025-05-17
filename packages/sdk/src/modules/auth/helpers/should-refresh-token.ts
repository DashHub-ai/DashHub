import * as E from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';

import { Time } from '@dashhub/commons';

import { ofUnsafeToken } from './of-unsafe-token';

export const shouldRefreshToken = flow(
  ofUnsafeToken,
  E.map(({ exp }) => Date.now() + +Time.toMilliseconds.minutes(3) > exp),
);
