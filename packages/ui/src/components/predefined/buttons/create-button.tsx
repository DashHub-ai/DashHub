import { PlusIcon } from 'lucide-react';

import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/components/form';
import { useForwardedI18n } from '~/i18n';

type Props = Omit<FormSpinnerCTAProps, 'children'>;

export function CreateButton({ className, ...props }: Props) {
  const { pack } = useForwardedI18n();

  return (
    <FormSpinnerCTA {...props}>
      <PlusIcon size={16} className="mr-2" />

      {pack.buttons.create}
    </FormSpinnerCTA>
  );
}
