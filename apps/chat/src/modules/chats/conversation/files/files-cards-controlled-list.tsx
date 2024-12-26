import { controlled } from '@under-control/forms';
import clsx from 'clsx';

import { without } from '@llm/commons';

import type { FileCardFile } from './file-card';

import { FilesCardsList } from './files-cards-list';

type Props = {
  className?: string;
};

export const FilesCardsControlledList = controlled<FileCardFile[], Props>(({ className, control: { value, setValue } }) => {
  const handleRemove = (file: FileCardFile) => {
    setValue({
      value: without([file])(value),
    });
  };

  if (!value?.length) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex flex-row gap-5',
        className,
      )}
    >
      <FilesCardsList
        items={value}
        itemPropsFn={file => ({
          onRemove: () => handleRemove(file),
        })}
      />
    </div>
  );
});
