import {
  FileAxis3DIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
} from 'lucide-react';

import {
  isImageFileUrl,
  isMarkdownFileUrl,
  isPDFFileUrl,
  isSpreadsheetFileUrl,
  isWordFileUrl,
} from '@llm/commons';

export function getFileTypeAndColor(url: string) {
  if (isSpreadsheetFileUrl(url)) {
    return {
      type: 'Excel',
      bgColor: 'bg-[#217346]',
      icon: FileSpreadsheetIcon,
    };
  }

  if (isWordFileUrl(url)) {
    return {
      type: 'Word',
      bgColor: 'bg-[#2B579A]',
      icon: FileTextIcon,
    };
  }

  if (isPDFFileUrl(url)) {
    return {
      type: 'PDF',
      bgColor: 'bg-[#D93F3F]',
      icon: FileAxis3DIcon,
    };
  }

  if (isImageFileUrl(url)) {
    return {
      type: 'Image',
      bgColor: 'bg-purple-500',
      icon: ImageIcon,
    };
  }

  if (isMarkdownFileUrl(url)) {
    return {
      type: 'Markdown',
      bgColor: 'bg-[#000000]',
      icon: FileTextIcon,
    };
  }

  return {
    type: 'TXT',
    bgColor: 'bg-gray-400',
    icon: FileIcon,
  };
}
