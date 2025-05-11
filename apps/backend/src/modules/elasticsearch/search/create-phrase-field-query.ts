import * as esb from 'elastic-builder';

import { rejectFalsyItems } from '@dashhub/commons';

export function createPhraseFieldQuery(field: string = 'name') {
  return (phrase: string): esb.BoolQuery => {
    const normalizedPhrase = normalizeEsSearchPhrase(phrase);
    const autocompleteField = `${field}.autocomplete`;

    return esb.boolQuery().should(
      rejectFalsyItems([
        phrase && Number.isNaN(+phrase)
          ? null
          : esb.termQuery('id', phrase).boost(4),
        esb
          .termQuery(field, phrase)
          .boost(4),
        esb
          .prefixQuery(`${field}.raw_normalized`, normalizedPhrase)
          .boost(3),
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
          .queryStringQuery(`*${normalizedPhrase}*`)
          .field(field)
          .analyzeWildcard(true)
          .defaultOperator('AND')
          .allowLeadingWildcard(true)
          .boost(1.5),
        esb
          .matchQuery(`${field}.text`, normalizedPhrase)
          .fuzziness('auto')
          .operator('and'),
      ]),
    );
  };
}

function normalizeEsSearchPhrase(phrase: string) {
  return phrase.trim().replaceAll(/[^a-z0-9 ]/gi, '').toLowerCase();
}
