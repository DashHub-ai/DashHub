import { useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';
import { KeyRoundIcon } from 'lucide-react';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkEmailLoginInputT, useSdk } from '@llm/sdk';
import {
  FormErrorAlert,
  FormField,
  FormSpinnerCTA,
  Input,
  usePredefinedFormValidators,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { ContinueWithDivider } from '../parts';
import { LoginTerms } from '../parts/login-terms';

type Props = {
  defaultValue?: Partial<SdkEmailLoginInputT>;
  onLoginUsingPassword?: (value: SdkEmailLoginInputT) => void;
  onAfterLogin?: (value: SdkEmailLoginInputT) => void;
};

export function LoginUsingEmail(
  {
    defaultValue,
    onLoginUsingPassword,
    onAfterLogin = () => {},
  }: Props,
) {
  const { sdks } = useSdk();
  const t = useI18n().pack.routes.login;

  const { emailFormatValidator } = usePredefinedFormValidators<SdkEmailLoginInputT>();
  const { handleSubmitEvent, validator, bind, value, submitState } = useForm({
    resetAfterSubmit: false,
    validation: {
      mode: ['submit', 'blur'],
      validators: () => [
        emailFormatValidator('email'),
      ],
    },
    defaultValue: {
      email: '',
      ...defaultValue,
    },
    onSubmit: flow(
      sdks.auth.emailLogin,
      tapTaskEither(() => onAfterLogin(value)),
      runTask,
    ),
  });

  return (
    <div className="space-y-6 w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">
          {t.emailStep.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t.emailStep.description}
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmitEvent}>
        <FormField {...validator.errors.extract('email')}>
          <Input
            name="email"
            type="email"
            placeholder={t.emailStep.email}
            autoComplete="email"
            required
            {...bind.path('email')}
          />
        </FormField>

        <FormErrorAlert result={submitState.result} />

        <FormSpinnerCTA loading={submitState.loading} className="w-full">
          {t.cta.loginUsingEmail}
        </FormSpinnerCTA>
      </form>

      <ContinueWithDivider />

      <button
        type="button"
        className="w-full uk-button uk-button-default"
        onClick={() => {
          onLoginUsingPassword?.(value);
        }}
      >
        <KeyRoundIcon size={16} className="mr-2 w-4 h-4" />
        {t.cta.loginUsingPassword}
      </button>

      <LoginTerms />
    </div>
  );
}
