import { controlled } from '@under-control/forms';

import type { SdkAIExternalAPISchemaT } from '@llm/sdk';

export const AISchemaCreator = controlled<SdkAIExternalAPISchemaT>(() => {
  return <span>ABC</span>;
});
