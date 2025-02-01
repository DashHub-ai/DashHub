import { PlusIcon } from 'lucide-react';

import { useI18n } from '~/i18n';
import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/ui/components/form';

type Props = Omit<FormSpinnerCTAProps, 'children'>;

export function AddButton({ loading, ...props }: Props) {
  const { pack } = useI18n();

  return (
    <FormSpinnerCTA loading={loading} {...props}>
      {!loading && (
        <PlusIcon size={16} className="mr-2" />
      )}

      {pack.buttons.add}
    </FormSpinnerCTA>
  );
}
