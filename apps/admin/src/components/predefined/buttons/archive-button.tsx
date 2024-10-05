import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/components/form';
import { useI18n } from '~/i18n';

type Props = Omit<FormSpinnerCTAProps, 'children'>;

export function ArchiveButton({ className, ...props }: Props) {
  const { pack } = useI18n();

  return (
    <FormSpinnerCTA {...props}>
      {pack.buttons.archive}
    </FormSpinnerCTA>
  );
}
