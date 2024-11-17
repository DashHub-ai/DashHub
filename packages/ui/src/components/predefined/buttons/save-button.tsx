import { SendIcon } from 'lucide-react';

import { FormSpinnerCTA, type FormSpinnerCTAProps } from '~/components/form';
import { useForwardedI18n } from '~/i18n';

type Props = Omit<FormSpinnerCTAProps, 'children'>;

export function SaveButton(props: Props) {
  const { pack } = useForwardedI18n();

  return (
    <FormSpinnerCTA {...props}>
      <SendIcon className="mr-2 w-4 h-4" />

      {pack.buttons.save}
    </FormSpinnerCTA>
  );
}
