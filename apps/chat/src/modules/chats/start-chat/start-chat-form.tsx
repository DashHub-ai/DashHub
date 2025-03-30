import type { KeyboardEventHandler } from 'react';

import clsx from 'clsx';
import { SendIcon } from 'lucide-react';

import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { StrictBooleanV } from '@llm/commons';
import { useFocusAfterMount, useLocalStorageObject } from '@llm/commons-front';
import { useI18n } from '~/i18n';
import { AIModelsSearchSelect } from '~/modules/ai-models';
import { ProjectsSearchSelect } from '~/modules/projects';
import { Checkbox, FormSpinnerCTA } from '~/ui';

import { AttachFileDropdown, FilesCardsControlledList, useChatFileDrop } from '../conversation';
import { ChatWebSearchButton } from '../conversation/input-toolbar';
import { useStartChatForm } from './use-start-chat-form';

type Props = {
  forceProject?: SdkTableRowWithIdNameT;
  className?: string;
  focusOnMount?: boolean;
};

export function StartChatForm(
  {
    forceProject,
    className,
    focusOnMount = true,
  }: Props,
) {
  const t = useI18n().pack.chats.start;
  const focusInputRef = useFocusAfterMount<HTMLTextAreaElement>(focusOnMount);

  const { loading, form, submitting } = useStartChatForm({ project: forceProject || null });
  const { bind, handleSubmitEvent, value } = form;

  const submitOnEnterStorage = useLocalStorageObject('start-chat-input-toolbar-submit-on-enter', {
    forceParseIfNotSet: true,
    schema: StrictBooleanV.catch(true),
    readBeforeMount: true,
  });

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (submitOnEnterStorage.getOrNull() && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (value.content.length) {
        void form.submit();
      }
    }
  };

  const fileDrop = useChatFileDrop({
    onDrop: (files: File[]) => {
      bind.path('files').onChange([...value.files ?? [], ...files]);
    },
  });

  return (
    <form
      className={clsx(
        'flex flex-col m-auto w-full min-w-0 max-w-4xl',
        'px-4 md:px-0',
        className,
      )}
      onSubmit={handleSubmitEvent}
      {...fileDrop.listeners}
    >
      <div
        className={clsx(
          'z-10 relative bg-white rounded-2xl',
          'border border-gray-200',
          'focus-within:border-gray-300',
          'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
          'transition-all duration-200',
          fileDrop.isDragging && 'border-blue-400 border-2 bg-blue-50',
        )}
      >
        <div
          className={clsx(
            'mb-14',
            fileDrop.isDragging && 'opacity-70',
          )}
        >
          <textarea
            ref={focusInputRef}
            name="message"
            className={clsx(
              'py-4 rounded-2xl w-full resize-none',
              'focus:outline-none',
              'text-gray-700 placeholder:text-gray-400',
              value.files?.length
                ? 'px-6 pb-3'
                : 'px-6',
            )}
            placeholder={t.placeholder}
            required
            {...bind.path('content')}
            onKeyDown={handleKeyDown}
          />

          <FilesCardsControlledList
            {...bind.path('files')}
            className="px-6 pb-4"
          />
        </div>

        <div
          className={clsx(
            'right-0 bottom-0 left-0 absolute',
            'px-4 py-3',
            'border-t border-gray-100',
            'bg-gray-50',
            'rounded-b-2xl',
            'flex items-center justify-between gap-4',
          )}
        >
          <div className="flex items-center gap-3">
            <AttachFileDropdown
              {...bind.path('files', {
                input: val => val ?? [],
              })}
            />

            <ChatWebSearchButton
              disabled={loading}
              {...bind.path('webSearch')}
            />

            <AIModelsSearchSelect
              buttonClassName="text-sm py-1 px-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              placeholderClassName="text-gray-700"
              placeholder={t.selectModel}
              className="min-w-36"
              withSearch={false}
              disabled={loading}
              preload
              {...bind.path('aiModel')}
            />

            {!forceProject && (
              <ProjectsSearchSelect
                buttonClassName="text-sm py-1 px-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                placeholderClassName="text-gray-700"
                placeholder={t.selectProject}
                {...bind.path('project')}
              />
            )}
          </div>

          <div className="flex items-center gap-4">
            <Checkbox
              className="flex items-center text-gray-600 text-sm"
              checkboxClassName="mt-[1px]"
              value={!!submitOnEnterStorage.getOrNull()}
              onChange={submitOnEnterStorage.set}
            >
              {t.startOnEnter}
            </Checkbox>

            <FormSpinnerCTA
              type="submit"
              loading={submitting}
              className={clsx(
                'px-4 py-2 rounded-lg',
                'bg-gray-900 hover:bg-black',
                'text-white font-medium',
                'transition-colors duration-200',
                'flex items-center gap-2',
                'disabled:opacity-50',
              )}
              disabled={loading || !value.content}
            >
              {!submitting && <SendIcon size={18} />}
              {t.start}
            </FormSpinnerCTA>
          </div>
        </div>
      </div>
    </form>
  );
}
