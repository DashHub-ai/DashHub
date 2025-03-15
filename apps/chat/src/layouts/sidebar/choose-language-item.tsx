import { findItemById } from '@llm/commons';
import { type I18nLangT, useI18n } from '~/i18n';
import { Select } from '~/ui';

export function ChooseLanguageItem() {
  const {
    lang: currentLang,
    getSupportedLanguages,
    setLanguage,
  } = useI18n();

  const items = getSupportedLanguages().map(lang => ({
    id: lang,
    name: lang.toUpperCase(),
  }));

  return (
    <Select
      dropdownClassName="min-w-full"
      items={items}
      value={
        findItemById(currentLang)(items)!
      }
      onChange={(lang) => {
        setLanguage((lang?.id ?? 'en') as I18nLangT);
      }}
    />
  );
}
