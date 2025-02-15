import type { SdkMessageFileT } from '@llm/sdk';

import { xml } from '../xml';

export function createAttachedFilesMessagePrefix(files: SdkMessageFileT[]) {
  return (content: string) => {
    const contextMessage = xml('file-context', {
      children: [
        xml('behavior', {
          children: [
            xml('no-files-handling', {
              children: [
                xml('rule', { children: ['If no files are attached to current message, look for files in previous messages'] }),
                xml('rule', { children: ['If no files are mentioned and none found in previous messages, do not reference files'] }),
              ],
            }),
            xml('file-analysis-rules', {
              children: [
                xml('rule', { children: ['Skip describing file contents unless necessary for the response'] }),
                xml('rule', { children: ['Defer to attached app for file content analysis when available'] }),
                xml('rule', { children: ['Use attached app approach for file content analysis'] }),
                xml('rule', { children: ['Add relevant comments to file content when appropriate'] }),
              ],
            }),
          ],
        }),
        files.length > 0 && xml('attached-files', {
          children: [
            xml('files-list', {
              children: files.map(file =>
                xml('file', {
                  attributes: { name: file.resource.name },
                }),
              ),
            }),
          ],
        }),
      ],
    });

    const promptMessage = xml('user-prompt', {
      children: [content],
    });

    return [promptMessage, '\n---\n', contextMessage, '\n---\n'].join('\n');
  };
}
