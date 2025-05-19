import type { FalsyItem } from '@dashhub/commons';

import { xml } from '../xml';

type Attrs = {
  userPrompt: string;
  preferredLanguageCode?: string;
  children?: Array<FalsyItem<string>>;
};

export function wrapUserPromptWithAiTags(
  {
    userPrompt,
    preferredLanguageCode,
    children = [],
  }: Attrs,
): string {
  return xml('message', {
    children: [
      xml('user-prompt', {
        children: [userPrompt],
      }),
      xml('language-detection', {
        children: [
          `It is CRITICALLY IMPORTANT to accurately detect the language used in the user-prompt tag. `
          + `Carefully analyze the text in the user-prompt to determine the language. `
          + `If language detection is uncertain${preferredLanguageCode ? `, default to ${preferredLanguageCode}` : ''}. `
          + `You MUST respond in the same language as the user's prompt. `
          + `Focus ONLY on the language in the user-prompt tag, `
          + `ignoring any language in embeddings, files, quoted messages, or other content `
          + `unless the user explicitly requests otherwise. `
          + `The accuracy of language detection directly impacts the quality of your response.`,
        ],
      }),
      ...children,
    ],
  });
};
