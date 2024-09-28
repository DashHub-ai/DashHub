import * as esb from 'elastic-builder';

import { rejectFalsyItems } from '@llm/commons';

export function createPhraseFieldQuery(field: string = 'name') {
  return (phrase: string): esb.BoolQuery => {
    const normalizedPhrase = normalizeEsSearchPhrase(phrase);

    const autocompleteField = `${field}.autocomplete`;
    const rawField = `${field}.raw`;

    return esb.boolQuery().should(
      rejectFalsyItems([
        phrase && Number.isNaN(+phrase)
          ? null
          : esb.termQuery('id', phrase).boost(4),
        esb
          .multiMatchQuery(
            [
              autocompleteField,
              `${autocompleteField}._2gram`,
              `${autocompleteField}._3gram`,
              `${autocompleteField}._4gram`,
            ],
            normalizedPhrase,
          )
          .type('bool_prefix')
          .operator('and')
          .boost(2),
        esb
          .matchQuery(field, normalizedPhrase)
          .fuzziness('auto')
          .operator('and'),
        esb
          .queryStringQuery(`*${normalizedPhrase}*`)
          .field(rawField)
          .analyzeWildcard(true)
          .defaultOperator('AND')
          .allowLeadingWildcard(true),
      ]),
    );
  };
}

function normalizeEsSearchPhrase(phrase: string) {
  return phrase.trim().replaceAll(/[^a-z0-9 ]/gi, '');
}
