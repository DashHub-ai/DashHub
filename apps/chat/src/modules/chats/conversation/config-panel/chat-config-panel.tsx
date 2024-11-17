import { useForm } from '@under-control/forms';
import clsx from 'clsx';
import { ChevronRight, Cog } from 'lucide-react';

import type { SdkChatT } from '@llm/sdk';

import { StrictBooleanV } from '@llm/commons';
import { useLocalStorageObject } from '@llm/commons-front';
import { Checkbox, FormField, Input, SaveButton, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';

import { ChatConfigTutorial } from './chat-config-tutorial';

type Props = {
  defaultValue: SdkChatT;
};

export function ChatConfigPanel({ defaultValue }: Props) {
  const collapsedStorage = useLocalStorageObject('chat-config-panel-state', {
    schema: StrictBooleanV.catch(false),
    readBeforeMount: true,
  });

  const isCollapsed = !!collapsedStorage.getOrNull();

  const t = useI18n().pack.chat.config;
  const { bind, validator, value, submitState, isDirty } = useForm({
    onSubmit: () => {},
    defaultValue,
  });

  return (
    <div
      className={clsx(
        'relative border-gray-200 border-l transition-all duration-300',
        isCollapsed ? 'w-12' : 'w-[450px]',
      )}
    >
      <button
        type="button"
        onClick={() => collapsedStorage.set(!isCollapsed)}
        className="top-[40%] -left-3 absolute flex flex-col items-center gap-2 border-gray-200 bg-white hover:bg-gray-100 shadow-sm px-1 py-4 border rounded-lg -translate-y-1/2"
      >
        <Cog size={16} />
        <ChevronRight
          size={16}
          className={clsx(
            'transition-transform duration-300',
            isCollapsed ? 'rotate-180' : 'rotate-0',
          )}
        />
      </button>

      <div className="p-4 pl-10">
        <h2 className={clsx(
          'font-semibold text-xl transition-opacity',
          isCollapsed ? 'opacity-0' : 'opacity-100',
        )}
        >
          {t.title}
        </h2>
      </div>

      <div className={clsx(
        'transition-opacity duration-300',
        isCollapsed ? 'opacity-0 hidden' : 'opacity-100',
      )}
      >
        <div className="px-6 pb-4 pl-10">
          <form className="space-y-4">
            <fieldset className="space-y-4">
              <legend className="font-medium text-gray-700 text-sm">{t.summary}</legend>

              <FormField
                {...validator.errors.extract('summary.name')}
                label={t.name}
              >
                <div className="space-y-2">
                  <Input
                    {...bind.path('summary.name.value', { input: value => value ?? '' })}
                    placeholder={t.namePlaceholder}
                    disabled={value.summary?.name.generated}
                  />

                  <Checkbox
                    {...bind.path('summary.name.generated')}
                    className="block pt-2 uk-text-small"
                  >
                    {t.generated}
                  </Checkbox>
                </div>
              </FormField>

              <FormField
                {...validator.errors.extract('summary.content')}
                label={t.description}
              >
                <div className="space-y-2">
                  <TextArea
                    {...bind.path('summary.content.value', { input: value => value ?? '' })}
                    placeholder={t.descriptionPlaceholder}
                    className="min-h-[100px]"
                    disabled={value.summary?.content.generated}
                  />

                  <Checkbox
                    {...bind.path('summary.content.generated')}
                    className="block pt-2 uk-text-small"
                  >
                    {t.generated}
                  </Checkbox>
                </div>
              </FormField>
            </fieldset>

            <div className="flex flex-row justify-end mt-4 pt-4 border-t">
              <SaveButton
                disabled={!isDirty}
                loading={submitState.loading}
                type="submit"
              />
            </div>
          </form>

          <ChatConfigTutorial />
        </div>
      </div>
    </div>
  );
}
