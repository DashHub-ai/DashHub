import type { SdkMessageFileT } from '@llm/sdk';

export function createAttachedFilesMessagePrefix(files: SdkMessageFileT[]) {
  return (content: string) => {
    if (!files.length) {
      return content;
    }

    return [
      content,
      '\n---\n',
      'User attached these files to this message:',
      ...files.map(file => `- ${file.resource.name}`),
      '\n---\n',
    ].join('\n');
  };
}
