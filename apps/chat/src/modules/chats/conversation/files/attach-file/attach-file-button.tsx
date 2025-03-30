import { controlled } from '@under-control/forms';
import clsx from 'clsx';
import { pipe } from 'fp-ts/lib/function';
import { PaperclipIcon } from 'lucide-react';

import { tapTaskOption } from '@llm/commons';

import { selectChatFile } from '../select-chat-file';

type Props = {
  disabled?: boolean;
};

export const AttachFileButton = controlled<File[], Props>(({ disabled, control: { value, setValue } }) => {
  const onAttachFile = pipe(
    selectChatFile,
    tapTaskOption((file) => {
      setValue({
        value: [...(value ?? []), file],
      });
    }),
  );

  return (
    <button
      type="button"
      className={clsx(
        'hover:bg-gray-100 p-2 rounded-lg',
        'text-gray-500 hover:text-gray-700',
        'transition-colors duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      disabled={disabled}
      onClick={onAttachFile}
    >
      <PaperclipIcon size={20} />
    </button>
  );
});
