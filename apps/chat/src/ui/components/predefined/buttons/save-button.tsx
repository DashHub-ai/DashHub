import { SendIcon } from 'lucide-react';

import { useI18n } from '~/i18n';
import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/ui/components/form';

type Props = Omit<FormSpinnerCTAProps, 'children'> & {
  withIcon?: boolean;
};

export function SaveButton({ loading, withIcon = true, ...props }: Props) {
  const { pack } = useI18n();

  return (
    <FormSpinnerCTA loading={loading} {...props}>
      {withIcon && !loading && <SendIcon className="mr-2 w-4 h-4" />}

      {pack.buttons.save}
    </FormSpinnerCTA>
  );
}
