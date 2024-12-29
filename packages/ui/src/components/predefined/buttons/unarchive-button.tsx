import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/components/form';
import { useForwardedI18n } from '~/i18n';

type Props = Omit<FormSpinnerCTAProps, 'children'>;

export function UnarchiveButton(props: Props) {
  const { pack } = useForwardedI18n();

  return (
    <FormSpinnerCTA {...props}>
      {pack.buttons.unarchive}
    </FormSpinnerCTA>
  );
}
