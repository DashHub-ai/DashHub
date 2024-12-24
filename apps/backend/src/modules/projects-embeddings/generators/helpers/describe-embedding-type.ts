import {
  isDocumentFileUrl,
  isImageFileUrl,
  isMarkdownFileUrl,
  isPresentationFileUrl,
  isSpreadsheetFileUrl,
} from '@llm/commons';

export function describeEmbeddingType(fileUrl: string): string {
  switch (true) {
    case isImageFileUrl(fileUrl):
      return 'Image, Picture';

    case isSpreadsheetFileUrl(fileUrl):
      return 'Spreadsheet';

    case isDocumentFileUrl(fileUrl):
      return 'Document';

    case isPresentationFileUrl(fileUrl):
      return 'Presentation';

    case isMarkdownFileUrl (fileUrl):
      return 'Markdown';
  }

  return 'Text';
}
