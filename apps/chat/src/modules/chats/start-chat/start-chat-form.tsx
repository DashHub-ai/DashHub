import type { KeyboardEventHandler } from 'react';

import clsx from 'clsx';
import { pipe } from 'fp-ts/function';
import { PaperclipIcon, SendIcon } from 'lucide-react';

import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { StrictBooleanV, tapTaskOption } from '@llm/commons';
import { useFocusAfterMount, useLocalStorageObject } from '@llm/commons-front';
import { Checkbox, FormSpinnerCTA } from '@llm/ui';
import { useI18n } from '~/i18n';
import { AIModelsSearchSelect } from '~/modules/ai-models';
import { ProjectsSearchSelect } from '~/modules/projects';

import { FilesCardsControlledList, selectChatFile } from '../conversation';
import { useStartChatForm } from './use-start-chat-form';

type Props = {
  forceProject?: SdkTableRowWithIdNameT;
  className?: string;
};

export function StartChatForm({ forceProject, className }: Props) {
  const t = useI18n().pack.chats.start;
  const focusInputRef = useFocusAfterMount<HTMLTextAreaElement>();

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

  const onAttachFile = pipe(
    selectChatFile,
    tapTaskOption((file) => {
      bind.path('files').onChange([...value.files ?? [], file]);
    }),
  );

  return (
    <form
      className={clsx(
        'flex flex-col m-auto w-full min-w-0 max-w-4xl',
        className,
      )}
      onSubmit={handleSubmitEvent}
    >
      <div
        className={clsx(
          'relative z-10 bg-background shadow-sm border border-border rounded-lg overflow-hidden',
          'focus-within:border-primary/50',
          'transition-border duration-100',
        )}
      >
        <div className="mb-[65px]">
          <textarea
            ref={focusInputRef}
            name="message"
            className="p-4 pb-0 w-full h-[80px] focus:outline-none resize-none"
            placeholder={t.placeholder}
            required
            {...bind.path('content')}
            onKeyDown={handleKeyDown}
          />

          <FilesCardsControlledList
            {...bind.path('files')}
            className="mt-4 px-4"
          />
        </div>

        <div className="bottom-4 left-3 absolute flex flex-row gap-4">
          <AIModelsSearchSelect
            buttonClassName="border-gray-300 border rounded-md h-7 text-xs"
            placeholderClassName="text-black text-xs"
            placeholder={t.selectModel}
            className="min-w-36"
            withSearch={false}
            disabled={loading}
            preload
            {...bind.path('aiModel')}
          />

          <Checkbox
            className="flex items-center text-sm"
            checkboxClassName="mt-[1px]"
            value={!!submitOnEnterStorage.getOrNull()}
            onChange={submitOnEnterStorage.set}
          >
            {t.startOnEnter}
          </Checkbox>
        </div>
      </div>

      <div className="flex-col border-gray-300 border-x bg-gray-100 mx-5 px-4 pt-4 pb-2 border-b border-solid rounded-b-xl md:rounded-b-2xl">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="border-gray-300 border uk-button uk-button-default"
            onClick={onAttachFile}
          >
            <PaperclipIcon size={16} className="mr-2" />
            {t.addFile}
          </button>

          {!forceProject && (
            <ProjectsSearchSelect
              buttonClassName="border-gray-300 border rounded-md bg-white"
              placeholderClassName="text-black"
              placeholder={t.selectProject}
              {...bind.path('project')}
            />
          )}

          {!!forceProject && (
            <Checkbox {...bind.path('public')}>
              {t.publicChat}
            </Checkbox>
          )}

          <div className="ml-auto">
            <FormSpinnerCTA
              type="submit"
              loading={submitting}
              className="uk-button uk-button-primary"
              disabled={loading || !value.content}
            >
              {!submitting && <SendIcon size={16} className="mr-2" />}
              {t.start}
            </FormSpinnerCTA>
          </div>
        </div>
      </div>
    </form>
  );
}
