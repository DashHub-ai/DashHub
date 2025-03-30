import { controlled } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';
import { ComputerIcon } from 'lucide-react';

import { tapTaskOption } from '@llm/commons';
import { useI18n } from '~/i18n';

import { selectChatFile } from '../select-chat-file';
import { AttachFileButton } from './attach-file-button';

type Props = {
  disabled?: boolean;
};

export const AttachFileDropdown = controlled<File[], Props>(({ disabled, control: { value, setValue } }) => {
  const t = useI18n().pack.chat.actions.files;

  const onAppendFile = (file: File) => {
    setValue({
      value: [...(value ?? []), file],
    });
  };

  const onAttachLocalFile = pipe(
    selectChatFile,
    tapTaskOption(onAppendFile),
  );

  return (
    <>
      <AttachFileButton disabled={disabled} />

      <div className="uk-drop uk-dropdown" uk-dropdown="mode: click">
        <ul className="uk-dropdown-nav uk-nav">
          <li>
            <a
              className="justify-between uk-drop-close"
              type="button"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                void onAttachLocalFile();
              }}
            >
              <span className="flex items-center gap-2">
                <ComputerIcon size={16} />
                {t.attachLocalFile}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
});
