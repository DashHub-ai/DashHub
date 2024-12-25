import clsx from 'clsx';
import {
  FileAxis3DIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
  XIcon,
} from 'lucide-react';

import {
  isImageFileUrl,
  isLegacyExcelMimetype,
  isLegacyWordMimetype,
  isPDFFileUrl,
  isPDFMimeType,
  isSpreadsheetFileUrl,
  isWordFileUrl,
} from '@llm/commons';
import { useI18n } from '~/i18n';

type Props = {
  file: File;
  onRemove: () => void;
};

export function FileCard({ file, onRemove }: Props) {
  const { pack } = useI18n();
  const { type, bgColor, icon: IconComponent } = getFileTypeAndColor(file);

  const isImage = isImageFileUrl(file.name);
  const imageUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div
      className={clsx(
        'relative gap-2 p-3 border rounded-lg h-[57px] group',
        isImage
          ? 'p-0 w-[128px]'
          : 'bg-gray-50 border-gray-200 w-[200px]',
      )}
    >
      <button
        title={pack.buttons.delete}
        type="button"
        onClick={onRemove}
        className="-top-2 -right-2 absolute bg-black p-1 rounded-full"
      >
        <XIcon className="w-3 h-3 text-white" />
      </button>

      {isImage && imageUrl
        ? (
            <img
              src={imageUrl}
              alt={file.name}
              className="rounded w-full h-full aspect-square object-contain"
            />
          )
        : (
            <div className="gap-2 grid grid-cols-[auto,1fr] min-w-0 overflow-hidden">
              <div className={clsx('flex items-center p-1 rounded', bgColor)}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>

              <div className="flex flex-col min-w-0">
                <span
                  className="font-semibold text-gray-700 text-xs truncate"
                  title={file.name}
                >
                  {file.name}
                </span>

                <span className="text-[10px] text-gray-500">
                  {type}
                </span>
              </div>
            </div>
          )}
    </div>
  );
}

function getFileTypeAndColor(file: File) {
  if (isSpreadsheetFileUrl(file.name) || isLegacyExcelMimetype(file.type)) {
    return {
      type: 'Excel',
      bgColor: 'bg-[#217346]',
      icon: FileSpreadsheetIcon,
    };
  }

  if (isLegacyWordMimetype(file.type) || isWordFileUrl(file.name)) {
    return {
      type: 'Word',
      bgColor: 'bg-[#2B579A]',
      icon: FileTextIcon,
    };
  }

  if (isPDFMimeType(file.type) || isPDFFileUrl(file.name)) {
    return {
      type: 'PDF',
      bgColor: 'bg-[#D93F3F]',
      icon: FileAxis3DIcon,
    };
  }

  if (isImageFileUrl(file.name)) {
    return {
      type: 'Image',
      bgColor: 'bg-purple-500',
      icon: ImageIcon,
    };
  }

  return {
    type: 'TXT',
    bgColor: 'bg-gray-400',
    icon: FileIcon,
  };
}
