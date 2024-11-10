import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/components/form';
import { useForwardedI18n } from '~/i18n';
import { UkIcon } from '~/icons';

type Props = Omit<FormSpinnerCTAProps, 'children'>;

export function CreateButton({ className, ...props }: Props) {
  const { pack } = useForwardedI18n();

  return (
    <FormSpinnerCTA {...props}>
      <UkIcon icon="plus" className="mr-2" />

      {pack.buttons.create}
    </FormSpinnerCTA>
  );
}
