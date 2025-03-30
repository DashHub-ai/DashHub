import { controlled } from '@under-control/forms';
import clsx from 'clsx';
import { pipe } from 'fp-ts/lib/function';
import { UploadIcon } from 'lucide-react';

import { tapTaskOption } from '@llm/commons';
import { useConfig } from '~/config';
import { useI18n } from '~/i18n';
import { useGoogleDriveFilePicker } from '~/modules/google-drive';
import { GoogleDriveSVG } from '~/ui';

import { selectChatFile } from '../select-chat-file';
import { AttachFileButton } from './attach-file-button';

type Props = {
  disabled?: boolean;
};

export const AttachFileDropdown = controlled<File[], Props>(({ disabled, control: { value, setValue } }) => {
  const config = useConfig();
  const t = useI18n().pack.chat.actions.files;

  const [selectGoogleDriveFile, attachGoogleFileStatus] = useGoogleDriveFilePicker();

  const onAttachGoogleDriveFile = async () => {
    const files = await selectGoogleDriveFile();

    setValue({
      value: [...(value ?? []), ...files ?? []],
    });
  };

  const onAttachLocalFile = pipe(
    selectChatFile,
    tapTaskOption((file: File) => {
      setValue({
        value: [...(value ?? []), file],
      });
    }),
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
                <UploadIcon size={16} />
                {t.attachLocalFile}
              </span>
            </a>
          </li>

          {config.googleDrive && (
            <li>
              <a
                className={clsx(
                  'justify-between uk-drop-close',
                  attachGoogleFileStatus.isLoading && 'opacity-50 cursor-not-allowed pointer-events-none',
                )}
                type="button"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  void onAttachGoogleDriveFile();
                }}
              >
                <span className="flex items-center gap-2">
                  <GoogleDriveSVG width={16} height={16} />
                  {t.attachGoogleDriveFile}
                </span>
              </a>
            </li>
          )}
        </ul>
      </div>
    </>
  );
});
