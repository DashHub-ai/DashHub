import levenshtein from 'fast-levenshtein';
import { z } from 'zod';

import type { SdkTranslatedStringT } from './sdk-translated-string.dto';

export const SdkFilteredPhraseInputV = z.object({
  phrase: z.string().optional(),
});

export type SdkFilteredPhraseInputT = z.TypeOf<typeof SdkFilteredPhraseInputV>;

/**
 * Parses a string with language prefix (e.g. "en:hello" or "pl:cześć")
 * into a translated string object
 */
export function sdkParseTranslatedPhrase(input: string) {
  const prefixMatch = input.match(/^([a-z]{2}):(.+)$/);

  if (prefixMatch) {
    const [, langCode, phrase] = prefixMatch;

    return {
      langCode,
      phrase,
    };
  }

  return {
    langCode: 'en',
    phrase: input,
  };
}

/**
 * Gets a specific translation from a translated string field
 */
export function sdkGetTranslation(
  {
    translations,
    langCode = '',
    fallbackLangCode = 'en',
  }: {
    translations: SdkTranslatedStringT | undefined;
    langCode?: string;
    fallbackLangCode?: string;
  },
): string {
  if (!translations)
    return '';

  // Try to get the translation for the requested language
  if (translations[langCode]) {
    return translations[langCode];
  }

  // Try fallback language
  if (fallbackLangCode && translations[fallbackLangCode]) {
    return translations[fallbackLangCode];
  }

  // Return any available translation
  const availableTranslation = Object.values(translations)[0];

  return availableTranslation || '';
}

/**
 * Searches for items in an array that have matching translations in the specified field
 */
export function sdkSearchByTranslatedField<T>(
  {
    phrase,
    langCode = '',
    translatedFieldGetter,
    threshold = 3,
  }: {
    phrase: string;
    langCode?: string;
    translatedFieldGetter: (item: T) => SdkTranslatedStringT | undefined;
    threshold?: number;
  },
) {
  return (items: T[]): T[] => {
    if (!phrase || phrase.trim() === '') {
      return items;
    }

    const searchTranslation = sdkParseTranslatedPhrase(phrase);
    const searchLangCode = Object.keys(searchTranslation)[0] || '';
    const searchText = Object.values(searchTranslation)[0] || '';

    // Use the language from the search phrase or fall back to provided langCode
    const effectiveLangCode = searchLangCode || langCode;

    // Filter and calculate distances
    const itemsWithDistance = items
      .map((item) => {
        const fieldTranslations = translatedFieldGetter(item);
        if (!fieldTranslations)
          return { item, distance: Infinity };

        const fieldText = sdkGetTranslation({
          translations: fieldTranslations,
          langCode: effectiveLangCode,
        });

        if (!fieldText)
          return { item, distance: Infinity };

        const distance = levenshtein.get(searchText.toLowerCase(), fieldText.toLowerCase());
        return { item, distance };
      })
      .filter(({ distance }) => distance <= threshold);

    // Sort by distance (closest match first)
    return itemsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .map(({ item }) => item);
  };
}
