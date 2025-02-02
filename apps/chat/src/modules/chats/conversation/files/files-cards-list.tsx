import clsx from 'clsx';
import { useMemo } from 'react';
import { v4 } from 'uuid';

import { FileCard, type FileCardFile, type FileCardProps } from './file-card';

type Props = {
  className?: string;
  items: FileCardFile[];
  itemPropsFn?: (file: FileCardFile) => Omit<FileCardProps, 'file'>;
};

export function FilesCardsList({ className, itemPropsFn, items }: Props) {
  const mappedFiles = useMemo(() => {
    const fileNames = new Set<string>();
    const duplicateNames = new Set<string>();

    items.forEach((file) => {
      if (fileNames.has(file.name)) {
        duplicateNames.add(file.name);
      }

      fileNames.add(file.name);
    });

    return items.map(file => ({
      id: duplicateNames.has(file.name) ? v4() : file.name,
      file,
    }));
  }, [items]);

  if (!mappedFiles) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex flex-row items-center gap-5',
        className,
      )}
    >
      {mappedFiles.map(({ file, id }) => (
        <FileCard
          key={id}
          file={file}
          {...itemPropsFn?.(file)}
        />
      ))}
    </div>
  );
}
