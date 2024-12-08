import { useI18n } from '~/i18n';

import { AppSharedFormFields, type AppSharedFormFieldsProps } from '../../shared';

type StepProps = AppSharedFormFieldsProps & {
  onBack?: () => void;
  loading?: boolean;
};

export function AppCreateFormStep2({ onBack, loading, ...props }: StepProps) {
  const { pack } = useI18n();
  const t = pack.appsCreator;

  return (
    <>
      <AppSharedFormFields {...props} />

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
