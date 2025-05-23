import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { useMemo } from 'react';

import { isImageFileUrl } from '@dashhub/commons';
import { useI18n } from '~/i18n';
import { getFileTypeAndColor } from '~/modules/shared';

export type FileCardFile =
  | File
  | { name: string; publicUrl: string; };

export type FileCardProps = {
  file: FileCardFile;
  limitWidth?: boolean;
  withBackground?: boolean;
  onRemove?: () => void;
};

export function FileCard({ file, withBackground, limitWidth = true, onRemove }: FileCardProps) {
  const { pack } = useI18n();
  const { type, bgColor, icon: IconComponent } = getFileTypeAndColor(file.name);

  const isImage = isImageFileUrl(file.name);
  const fileUrl = useMemo(() => {
    if ('publicUrl' in file) {
      return file.publicUrl;
    }

    return URL.createObjectURL(file);
  }, [file]);

  const onDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div
      className={clsx(
        'group relative gap-2 border rounded-lg h-[57px] cursor-pointer',
        'hover:scale-105 transition-transform',
        withBackground && 'bg-gray-50',
        isImage
          ? 'max-w-[128px]'
          : 'p-3 bg-gray-50 border-gray-200 w-[200px]',
        !limitWidth && 'w-auto max-w-[400px]',
      )}
      onClick={onDownload}
      role="button"
      title={pack.buttons.download}
    >
      {onRemove && (
        <button
          title={pack.buttons.delete}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="-top-2 -right-2 absolute bg-black p-1 rounded-full"
        >
          <XIcon className="w-3 h-3 text-white" />
        </button>
      )}

      {isImage && fileUrl
        ? (
            <img
              src={fileUrl}
              alt={file.name}
              className="rounded w-full h-full object-contain aspect-square"
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
