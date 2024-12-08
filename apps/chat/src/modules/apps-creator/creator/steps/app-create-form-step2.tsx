import { useI18n } from '~/i18n';

import type { StepProps } from './app-create-form-types';

import { AppSharedFormFields } from '../../shared';

export function AppCreateFormStep2({ onBack, loading, value, errors, bind }: StepProps & { errors: any; bind: any; }) {
  const { pack } = useI18n();
  const t = pack.appsCreator;

  return (
    <>
      <AppSharedFormFields
        organization={value.organization}
        errors={errors}
        {...bind}
      />

      <div>
        <button
          type="button"
          className="uk-button uk-button-default"
          onClick={onBack}
          disabled={loading}
        >
          {t.create.backStep}
        </button>

        <button
          type="submit"
          className="uk-float-right uk-button uk-button-primary"
          disabled={loading}
        >
          {pack.buttons.create}
        </button>
      </div>
    </>
  );
}
