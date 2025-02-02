import type { SdkMessageFileT } from '@llm/sdk';

export function createAttachedFilesMessagePrefix(files: SdkMessageFileT[]) {
  return (content: string) => {
    if (!files.length) {
      return [
        content,
        '\n---\n',
        '- User did not attach any files to this message, try lookup for the files in the previous messages.',
        '- If user did not mention anything about the files, and you not found any files in the previous messages, just don\'t mention the files.',
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
