type Attrs = {
  uuid?: boolean;
};

export function createBaseDatedRecordMappings(
  { uuid }: Attrs = {
    uuid: false,
  },
) {
  return {
    id: { type: uuid ? 'keyword' : 'integer' },
    created_at: { type: 'date' },
    updated_at: { type: 'date' },
  };
}
