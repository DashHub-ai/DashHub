import { useForm } from '@under-control/forms';

import type { SdkChatT } from '@llm/sdk';

import { Checkbox, FormField, Input, SaveButton, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';

import { ChatConfigTutorial } from './chat-config-tutorial';

type Props = {
  defaultValue: SdkChatT;
};

export function ChatConfigPanel({ defaultValue }: Props) {
  const t = useI18n().pack.chat.config;
  const { bind, validator, value, submitState } = useForm({
    onSubmit: () => {},
    defaultValue,
  });

  return (
    <div className="border-gray-200 p-4 border-l w-96">
      <form className="space-y-4">
        <FormField
          {...validator.errors.extract('summary.name')}
          label={t.name}
        >
          <div className="space-y-2">
            <Input
              {...bind.path('summary.name.value')}
              placeholder={t.namePlaceholder}
              disabled={value.summary?.name.generated}
            />

            <Checkbox
              {...bind.path('summary.name.generated')}
              className="block mt-2 uk-text-small"
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
              {...bind.path('summary.content.value')}
              placeholder={t.descriptionPlaceholder}
              className="min-h-[100px]"
              disabled={value.summary?.content.generated}
            />

            <Checkbox
              {...bind.path('summary.content.generated')}
              className="block mt-2 uk-text-small"
            >
              {t.generated}
            </Checkbox>
          </div>
        </FormField>

        <div className="flex flex-row justify-end mt-4 pt-4 border-t">
          <SaveButton
            loading={submitState.loading}
            type="submit"
          />
        </div>
      </form>

      <ChatConfigTutorial />
    </div>
  );
}
