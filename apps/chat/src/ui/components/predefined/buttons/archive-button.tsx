import { useI18n } from '~/i18n';
import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/ui/components/form';

type Props = Omit<FormSpinnerCTAProps, 'children'>;

export function ArchiveButton(props: Props) {
  const { pack } = useI18n();

  return (
    <FormSpinnerCTA {...props}>
      {pack.buttons.archive}
    </FormSpinnerCTA>
  );
}
