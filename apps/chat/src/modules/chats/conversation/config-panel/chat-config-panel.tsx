import type { SdkChatT } from '@llm/sdk';

import { Checkbox, CollapsiblePanel, FormAlertBoxes, FormField, Input, SaveButton, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';

import { ChatConfigArchive } from './chat-config-archive';
import { ChatConfigTutorial } from './chat-config-tutorial';
import { ChatConfigUnarchive } from './chat-config-unarchive';
import { useChatConfigForm } from './use-chat-config-form';

type Props = {
  defaultValue: SdkChatT;
};

export function ChatConfigPanel({ defaultValue }: Props) {
  const { pack } = useI18n();
  const t = pack.chat.config;
  const { bind, validator, value, submitState, isDirty, handleSubmitEvent } = useChatConfigForm({
    defaultValue,
  });

  return (
    <CollapsiblePanel
      storageKey="chat-config-panel-state"
      title={t.title}
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmitEvent}
      >
        <ChatConfigTutorial />

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
                disabled={value.summary?.name.generated || defaultValue.archived}
              />

              <Checkbox
                {...bind.path('summary.name.generated')}
                className="block pt-2 uk-text-small"
                disabled={defaultValue.archived}
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
                disabled={value.summary?.content.generated || defaultValue.archived}
              />

              <Checkbox
                {...bind.path('summary.content.generated')}
                className="block pt-2 uk-text-small"
                disabled={defaultValue.archived}
              >
                {t.generated}
              </Checkbox>
            </div>
          </FormField>
        </fieldset>

        <FormAlertBoxes result={submitState.result} />

        {!defaultValue.archived && (
          <div className="flex flex-row justify-end mt-4 pt-4 border-t">
            <SaveButton
              disabled={!isDirty}
              loading={submitState.loading}
              type="submit"
            />
          </div>
        )}
      </form>

      {(
        defaultValue.archived
          ? <ChatConfigUnarchive chat={defaultValue} />
          : <ChatConfigArchive chat={defaultValue} />
      )}
    </CollapsiblePanel>
  );
}
