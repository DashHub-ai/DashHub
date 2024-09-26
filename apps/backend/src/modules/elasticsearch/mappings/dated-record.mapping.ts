export function createBaseDatedRecordMappings() {
  return {
    id: { type: 'integer' },
    created_at: { type: 'date' },
    updated_at: { type: 'date' },
  };
}
