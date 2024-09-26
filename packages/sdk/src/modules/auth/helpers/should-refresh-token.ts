import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/function';

import { Time } from '@llm/commons';

import { ofUnsafeToken } from './of-unsafe-token';

export const shouldRefreshToken = flow(
  ofUnsafeToken,
  E.map(({ exp }) => Date.now() + +Time.toMilliseconds.minutes(3) > exp),
);
