import { SendIcon } from 'lucide-react';

import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/components/form';
import { useForwardedI18n } from '~/i18n';

type Props = Omit<FormSpinnerCTAProps, 'children'> & {
  withIcon?: boolean;
};

export function SaveButton({ loading, withIcon = true, ...props }: Props) {
  const { pack } = useForwardedI18n();

  return (
    <FormSpinnerCTA loading={loading} {...props}>
      {withIcon && !loading && <SendIcon className="mr-2 w-4 h-4" />}

      {pack.buttons.save}
    </FormSpinnerCTA>
  );
}
