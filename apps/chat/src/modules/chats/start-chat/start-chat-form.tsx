import type { KeyboardEventHandler } from 'react';

import clsx from 'clsx';
import { PaperclipIcon, SendIcon } from 'lucide-react';

import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { StrictBooleanV } from '@llm/commons';
import { useFocusAfterMount, useLocalStorageObject } from '@llm/commons-front';
import { Checkbox, FormSpinnerCTA } from '@llm/ui';
import { useI18n } from '~/i18n';
import { AIModelsSearchSelect } from '~/modules/ai-models';
import { ProjectsSearchSelect } from '~/modules/projects';

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

  return (
    <form
      className={clsx(
        'flex flex-col m-auto w-full min-w-0 max-w-4xl',
        className,
      )}
      onSubmit={handleSubmitEvent}
    >
      <div className="relative z-10">
        <textarea
          ref={focusInputRef}
          name="message"
          className="focus:border-primary bg-background shadow-sm p-4 pb-[45px] border border-border rounded-lg w-full min-h-[130px] focus:outline-none resize-none"
          placeholder={t.placeholder}
          required
          {...bind.path('content')}
          onKeyDown={handleKeyDown}
        />

        <div className="bottom-3 left-3 absolute flex flex-row gap-4">
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
            className="border-gray-300 border pointer-events-none uk-button uk-button-default"
            disabled
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
