import { InputWithIcon } from '~/components';
import { useI18n } from '~/i18n';
import { UkIcon } from '~/icons';

export function SearchBarInput() {
  const t = useI18n().pack.modules.searchBar;

  return (
    <InputWithIcon
      icon={<UkIcon icon="search" />}
      placeholder={t.input.placeholder}
    />
  );
}
