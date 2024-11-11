import { PaperclipIcon, SendIcon } from 'lucide-react';

import { Checkbox, Select } from '@llm/ui';
import { useI18n } from '~/i18n';

import { useStartChatForm } from './use-start-chat-form';

export function StartChatSection() {
  const t = useI18n().pack.startChat;
  const { bind, handleSubmitEvent } = useStartChatForm({
    onSubmit: (data) => {
      // eslint-disable-next-line no-console
      console.info(data);
    },
  });

  return (
    <section className="mx-auto px-4 max-w-3xl container">
      <h2 className="mb-6 font-semibold text-2xl text-center">
        {t.hello}
      </h2>

      <form
        className="flex flex-col m-auto w-full min-w-0 max-w-4xl"
        onSubmit={handleSubmitEvent}
      >
        <div className="relative z-10">
          <textarea
            name="message"
            className="focus:border-primary bg-background p-4 pb-[45px] border border-border rounded-lg w-full min-h-[130px] resize-none focus:outline-none shadow-sm"
            placeholder={t.placeholder}
            required
            {...bind.path('message')}
          />

          <div className="bottom-3 left-3 absolute">
            <Select
              buttonClassName="border-gray-300 border rounded-md h-7 text-xs"
              placeholderClassName="text-black text-xs"
              placeholder={t.selectModel}
              items={[
                { id: 'gpt-4', name: 'GPT-4' },
                { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
              ]}
              className="w-36"
              {...bind.path('model')}
            />
          </div>
        </div>

        <div className="flex-col border-gray-300 border-x bg-gray-100 mx-5 px-4 pt-4 pb-2 border-b border-solid rounded-b-xl md:rounded-b-2xl">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="uk-button uk-button-default"
              onClick={() => {
                // Handle file input click
              }}
            >
              <PaperclipIcon size={16} className="mr-2" />
              {t.addFile}
            </button>

            <Select
              buttonClassName="border-gray-300 border rounded-md bg-white"
              placeholderClassName="text-black"
              placeholder={t.selectProject}
              items={[]}
              {...bind.path('project')}
            />

            <Checkbox {...bind.path('public')}>
              {t.publicChat}
            </Checkbox>

            <div className="ml-auto">
              <button
                type="submit"
                className="uk-button uk-button-primary"
              >
                <SendIcon size={16} className="mr-2" />
                {t.start}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
