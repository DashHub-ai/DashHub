import { InputWithIcon, type InputWithIconProps, UkIcon } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props = Omit<InputWithIconProps, 'icon' | 'placeholder'>;

export function SearchBarInput(props: Props) {
  const t = useI18n().pack.modules.searchBar;

  return (
    <InputWithIcon
      icon={<UkIcon icon="search" />}
      placeholder={t.input.placeholder}
      {...props}
    />
  );
}
