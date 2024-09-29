export function createAutocompleteFieldAnalyzeSettings() {
  return {
    char_filter: {
      special_characters_char_filter: {
        type: 'mapping',
        mappings: ['_ => ', '- => ', '/ => ', '. => ', '@ => '],
      },
    },
    analyzer: {
      folded_lowercase_analyzer: {
        tokenizer: 'standard',
        filter: ['lowercase', 'asciifolding'],
        char_filter: ['special_characters_char_filter'],
      },
    },
    normalizer: {
      folded_lowercase_normalizer: {
        type: 'custom',
        filter: ['lowercase', 'asciifolding'],
        char_filter: ['special_characters_char_filter'],
      },
    },
  };
}

export function createBaseAutocompleteFieldMappings(field: string = 'name') {
  return {
    [field]: {
      type: 'keyword',
      fields: {
        text: {
          type: 'text',
          analyzer: 'folded_lowercase_analyzer',
        },
        raw_normalized: {
          type: 'keyword',
          normalizer: 'folded_lowercase_normalizer',
        },
        autocomplete: {
          type: 'search_as_you_type',
        },
      },
    },
  };
}
