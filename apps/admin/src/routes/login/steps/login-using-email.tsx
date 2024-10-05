import { useForm } from '@under-control/forms';
import { flow } from 'fp-ts/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkEmailLoginInputT, useSdk } from '@llm/sdk';
import { FormErrorAlert, FormField, FormSpinnerCTA, Input } from '~/components';
import { usePredefinedFormValidators } from '~/hooks';
import { useI18n } from '~/i18n';
import { UkIcon } from '~/icons';

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
    <div className="w-[350px] space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.emailStep.title}
        </h1>
        <p className="text-sm text-muted-foreground">
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
        className="uk-button uk-button-default w-full"
        onClick={() => {
          onLoginUsingPassword?.(value);
        }}
      >
        <UkIcon icon="key-round" className="mr-2 h-4 w-4" />
        {t.cta.loginUsingPassword}
      </button>

      <LoginTerms />
    </div>
  );
}
