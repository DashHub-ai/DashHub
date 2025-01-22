import type { SdkMessageFileT } from '@llm/sdk';

export function createAttachedFilesMessagePrefix(files: SdkMessageFileT[]) {
  return (content: string) => {
    if (!files.length) {
      return [
        '\n---\n',
        'User did not attach any files to this message.',
        '\n---\n',
      ].join('\n');
    }

    return [
      content,
      '\n---\n',
      'User attached these files to this message:',
      ...files.map(file => `- ${file.resource.name}`),
      '\n---\n',
      'Rules for handling attached files:',
      '- Please skip describing the content of these files if it is not necessary.',
      '- If any app is attached, please let the application analyze the content of the files.',
      '- Use attached app approach to analyze the content of the files.',
      '- You can add your own comments to the content of the files.',
    ].join('\n');
  };
}
