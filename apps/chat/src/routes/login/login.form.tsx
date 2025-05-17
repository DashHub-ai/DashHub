import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { z } from 'zod';

import { useLocalStorageObject } from '@dashhub/commons-front';

import { LoginUsingEmail, LoginUsingPassword } from './steps';

export function LoginForm() {
  const settings = useLocalStorageObject('login-settings', {
    readBeforeMount: true,
    rerenderOnSet: true,
    schema: z.strictObject({
      step: z.enum(['email', 'password']),
      email: z.string().default(''),
    }),
  });

  const { step, email } = pipe(
    settings.get(),
    O.getOrElseW(() => ({
      step: 'password' as const,
      email: '',
    })),
  );

  const onSetAndRememberStep = (newStep: 'email' | 'password') => ({ email }: { email: string; }) => {
    settings.set({
      step: newStep,
      email,
    });
  };

  switch (step) {
    case 'email':
      return (
        <LoginUsingEmail
          defaultValue={{
            email,
          }}
          onAfterLogin={onSetAndRememberStep('email')}
          onLoginUsingPassword={onSetAndRememberStep('password')}
        />
      );

    case 'password':
      return (
        <LoginUsingPassword
          defaultValue={{
            email,
          }}
          onAfterLogin={onSetAndRememberStep('password')}
          onLoginUsingEmail={onSetAndRememberStep('email')}
        />
      );
  }
}
