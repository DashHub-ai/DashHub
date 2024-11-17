export function createAIGeneratedFieldMappings(additionalMappings?: object) {
  return {
    properties: {
      generated: { type: 'boolean' },
      generated_at: { type: 'date' },
      value: { type: 'text' },
      ...additionalMappings,
    },
  };
}
