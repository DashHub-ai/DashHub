import { type FalsyItem, rejectFalsyItems } from '@llm/commons';

export function wrapWithPersonaPromptHeader(
  persona: string,
  prompt: Array<FalsyItem<string>>,
): string {
  return rejectFalsyItems([
    `******** PERSONA: ${persona.toUpperCase()} ********`,
    ...prompt,
    '',
  ]).join('\n');
}
