import { type FalsyItem, rejectFalsyItems } from '@llm/commons';

export function wrapWithFeaturePromptHeader(
  section: string,
  prompt: Array<FalsyItem<string>>,
): string {
  return rejectFalsyItems([
    `******** FEATURE: ${section.toUpperCase()} ********`,
    ...prompt,
    '',
  ]).join('\n');
}
