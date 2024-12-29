import { PlusIcon } from 'lucide-react';

import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/components/form';
import { useForwardedI18n } from '~/i18n';

type Props = Omit<FormSpinnerCTAProps, 'children'>;

export function AddButton({ loading, ...props }: Props) {
  const { pack } = useForwardedI18n();

  return (
    <FormSpinnerCTA loading={loading} {...props}>
      {!loading && (
        <PlusIcon size={16} className="mr-2" />
      )}

      {pack.buttons.add}
    </FormSpinnerCTA>
  );
}
