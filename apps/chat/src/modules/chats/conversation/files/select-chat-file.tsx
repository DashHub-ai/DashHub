import { selectFile } from '@llm/commons';

export const ACCEPTED_CHAT_FILE_TYPES = [
  '.pdf',
  '.csv',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.png',
  '.jpg',
  '.jpeg',
  '.bmp',
  '.txt',
  '.html',
  '.md',
];

export const selectChatFile = selectFile(ACCEPTED_CHAT_FILE_TYPES.join(','));
