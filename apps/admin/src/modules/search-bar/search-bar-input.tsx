import { SearchIcon } from 'lucide-react';

import { InputWithIcon, type InputWithIconProps } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props = Omit<InputWithIconProps, 'icon' | 'placeholder'>;

export function SearchBarInput(props: Props) {
  const t = useI18n().pack.modules.searchBar;

  return (
    <InputWithIcon
      icon={<SearchIcon size={16} />}
      placeholder={t.input.placeholder}
      {...props}
    />
  );
}
