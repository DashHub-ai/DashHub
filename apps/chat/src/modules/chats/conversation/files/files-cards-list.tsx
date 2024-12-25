import { controlled } from '@under-control/forms';
import clsx from 'clsx';
import { useMemo } from 'react';
import { v4 } from 'uuid';

import { without } from '@llm/commons';

import { FileCard } from './file-card';

type Props = {
  className?: string;
};

export const FilesCardsList = controlled<File[], Props>(({ className, control: { value, setValue } }) => {
  const mappedFiles = useMemo(() => {
    const fileNames = new Set<string>();
    const duplicateNames = new Set<string>();

    value.forEach((file) => {
      if (fileNames.has(file.name)) {
        duplicateNames.add(file.name);
      }

      fileNames.add(file.name);
    });

    return value.map(file => ({
      id: duplicateNames.has(file.name) ? v4() : file.name,
      file,
    }));
  }, [value]);

  if (!value?.length) {
    return null;
  }

  const handleRemove = (file: File) => {
    setValue({
      value: without([file])(value),
    });
  };

  return (
    <div
      className={clsx(
        'flex flex-row gap-5',
        className,
      )}
    >
      {mappedFiles.map(({ file, id }) => (
        <FileCard
          key={id}
          file={file}
          onRemove={() => handleRemove(file)}
        />
      ))}
    </div>
  );
});
