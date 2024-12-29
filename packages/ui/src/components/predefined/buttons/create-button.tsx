import { PlusIcon } from 'lucide-react';

import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/components/form';
import { useForwardedI18n } from '~/i18n';

type Props = Omit<FormSpinnerCTAProps, 'children'> & {
  withIcon?: boolean;
};

export function CreateButton({ loading, withIcon = true, ...props }: Props) {
  const { pack } = useForwardedI18n();

  return (
    <FormSpinnerCTA loading={loading} {...props}>
      {withIcon && !loading && <PlusIcon size={16} className="mr-2" />}
      {pack.buttons.create}
    </FormSpinnerCTA>
  );
}
