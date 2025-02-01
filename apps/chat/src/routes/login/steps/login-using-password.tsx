import { useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';
import { MailIcon } from 'lucide-react';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkPasswordLoginInputT, useSdk } from '@llm/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useI18n } from '~/i18n';
import { Checkbox, FormErrorAlert, FormField, FormSpinnerCTA, Input } from '~/ui';

import { ContinueWithDivider } from '../parts';
import { LoginTerms } from '../parts/login-terms';

type Props = {
  defaultValue?: Partial<SdkPasswordLoginInputT>;
  onLoginUsingEmail?: (value: SdkPasswordLoginInputT) => void;
  onAfterLogin?: (value: SdkPasswordLoginInputT) => void;
};

export function LoginUsingPassword(
  {
    defaultValue,
    onLoginUsingEmail,
    onAfterLogin = () => {},
  }: Props,
) {
  const { sdks } = useSdk();
  const t = useI18n().pack.routes.login;

  const { required, emailFormatValidator } = usePredefinedFormValidators<SdkPasswordLoginInputT>();
  const { handleSubmitEvent, validator, bind, value, submitState } = useForm({
    resetAfterSubmit: false,
    validation: {
      mode: ['submit', 'blur'],
      validators: () => [
        emailFormatValidator('email'),
        required('password'),
      ],
    },
    defaultValue: {
      email: '',
      password: '',
      remember: true,
      ...defaultValue,
    },
    onSubmit: flow(
      sdks.auth.passwordLogin,
      tapTaskEither(() => onAfterLogin(value)),
      runTask,
    ),
  });

  return (
    <div className="space-y-6 w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">
          {t.passwordStep.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t.passwordStep.description}
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmitEvent}>
        <FormField {...validator.errors.extract('email')}>
          <Input
            name="email"
            type="email"
            placeholder={t.passwordStep.email}
            autoComplete="email"
            required
            {...bind.path('email')}
          />
        </FormField>

        <FormField {...validator.errors.extract('password')}>
          <Input
            name="password"
            type="password"
            placeholder={t.passwordStep.password}
            autoComplete="password"
            required
            {...bind.path('password')}
          />
        </FormField>

        <FormField {...validator.errors.extract('remember')}>
          <Checkbox {...bind.path('remember')}>
            {t.passwordStep.remember}
          </Checkbox>
        </FormField>

        <FormErrorAlert result={submitState.result} />

        <FormSpinnerCTA loading={submitState.loading} className="w-full">
          {t.cta.loginUsingPassword}
        </FormSpinnerCTA>
      </form>

      <ContinueWithDivider />

      <button
        type="button"
        disabled={submitState.loading}
        className="w-full uk-button uk-button-default"
        onClick={() => {
          onLoginUsingEmail?.(value);
        }}
      >
        <MailIcon size={16} className="mr-2 w-4 h-4" />
        {t.cta.loginUsingEmail}
      </button>

      <LoginTerms />
    </div>
  );
}
