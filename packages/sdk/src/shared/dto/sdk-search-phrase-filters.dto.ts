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
 * Parameters for the boost function
 */
export type SdkBoostFunctionParamsT<T> = {
  item: T;
  distance: number;
  fieldText: string;
  phrase: string;
};

/**
 * Default boost function that converts distance to score and boosts items containing the search phrase
 */
export function sdkDefaultBoostFunction<T>(
  { distance, fieldText, phrase }: SdkBoostFunctionParamsT<T>,
): number {
  // Convert distance to a base score (lower distance = higher score)
  let score = 1 / (distance + 1);

  // Significantly boost if field contains the search phrase
  if (fieldText.toLowerCase().includes(phrase.toLowerCase())) {
    score *= 10; // Increased boost for substring matches
  }

  return score;
}

/**
 * Searches for items in an array that have matching translations in the specified field
 */
export function sdkSearchByTranslatedField<T>(
  {
    phrase,
    langCode,
    translatedFieldGetter,
    threshold = 3,
    boostFunction = sdkDefaultBoostFunction,
  }: {
    phrase: string;
    langCode: string;
    translatedFieldGetter: (item: T) => SdkTranslatedStringT | undefined;
    threshold?: number;
    boostFunction?: (params: SdkBoostFunctionParamsT<T>) => number;
  },
) {
  return (items: T[]): T[] => {
    if (!phrase || phrase.trim() === '') {
      return items;
    }

    // Calculate scores for each item
    const itemsWithScore = items
      .map((item) => {
        const fieldTranslations = translatedFieldGetter(item);
        if (!fieldTranslations) {
          return {
            item,
            score: 0,
          };
        }

        const fieldText = sdkGetTranslation({
          translations: fieldTranslations,
          langCode,
        });

        if (!fieldText) {
          return { item, score: 0 };
        }

        const distance = levenshtein.get(phrase.toLowerCase(), fieldText.toLowerCase());
        const containsSearchTerm = fieldText.toLowerCase().includes(phrase.toLowerCase());

        // Always include exact matches regardless of distance
        // Only apply threshold to items without the search term
        if (distance > threshold && !containsSearchTerm) {
          return { item, score: 0 };
        }

        // Apply boost function to get the final score
        const score = boostFunction({
          item,
          distance,
          fieldText,
          phrase,
        });

        return {
          item,
          score,
        };
      })
      .filter(({ score }) => score > 0);

    // Sort by score (highest first)
    return itemsWithScore
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  };
}
