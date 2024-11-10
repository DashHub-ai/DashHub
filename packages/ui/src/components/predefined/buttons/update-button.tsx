import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/components/form';
import { useForwardedI18n } from '~/i18n';

type Props = Omit<FormSpinnerCTAProps, 'children'>;

export function UpdateButton({ className, ...props }: Props) {
  const { pack } = useForwardedI18n();

  return (
    <FormSpinnerCTA {...props}>
      {pack.buttons.update}
    </FormSpinnerCTA>
  );
}