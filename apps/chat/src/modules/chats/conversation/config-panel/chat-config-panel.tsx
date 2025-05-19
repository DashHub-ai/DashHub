import { type SdkChatT, useSdkForLoggedIn } from '@dashhub/sdk';
import { useI18n } from '~/i18n';
import { NavigationToolbarPortal } from '~/layouts/navigation/navigation-toolbar-portal';
import { Checkbox, CollapsiblePanel, FormAlertBoxes, FormField, Input, SaveButton, TextArea } from '~/ui';

import { ChatConfigArchive } from './chat-config-archive';
import { ChatConfigUnarchive } from './chat-config-unarchive';
import { ShareChatNavigationRow } from './share-chat-navigation-row';
import { useChatConfigForm } from './use-chat-config-form';

type Props = {
  chat: SdkChatT;
  contentClassName?: string;
  onSilentReload: VoidFunction;
};

export function ChatConfigPanel({ chat, contentClassName, onSilentReload }: Props) {
  const { pack } = useI18n();
  const t = pack.chat.config;
  const { bind, validator, value, submitState, isDirty, handleSubmitEvent } = useChatConfigForm({
    defaultValue: {
      ...chat,
      permissions: chat.permissions?.current,
    },
  });

  const { createRecordGuard } = useSdkForLoggedIn();
  const { can } = createRecordGuard(chat);

  return (
    <CollapsiblePanel
      storageKey="chat-config-panel-state"
      title={t.title}
      contentClassName={contentClassName}
      defaultCollapsed
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmitEvent}
      >
        <fieldset className="space-y-4">
          {can?.write && (
            <NavigationToolbarPortal>
              <ShareChatNavigationRow
                chat={chat}
                onPermissionsUpdated={onSilentReload}
              />
            </NavigationToolbarPortal>
          )}

          <div className="font-medium text-gray-700 text-sm">
            {t.summary}
          </div>

          <FormField
            {...validator.errors.extract('summary.name')}
            label={t.name}
          >
            <div className="space-y-2">
              <Input
                {...bind.path('summary.name.value', { input: value => value ?? '' })}
                placeholder={t.namePlaceholder}
                disabled={value.summary.name.generated || chat.archived}
              />

              <Checkbox
                className="block pt-2 uk-text-small"
                disabled={chat.archived}
                {...bind.path('summary.name.generated', {
                  relatedInputs: ({ newGlobalValue }) => ({
                    ...newGlobalValue,
                    summary: {
                      ...newGlobalValue.summary,
                      name: {
                        ...newGlobalValue.summary.name,
                        value: null,
                      },
                    },
                  }),
                })}
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
                disabled={value.summary.content.generated || chat.archived}
              />

              <Checkbox
                className="block pt-2 uk-text-small"
                disabled={chat.archived}
                {...bind.path('summary.content.generated', {
                  relatedInputs: ({ newGlobalValue }) => ({
                    ...newGlobalValue,
                    summary: {
                      ...newGlobalValue.summary,
                      content: {
                        ...newGlobalValue.summary.content,
                        value: null,
                      },
                    },
                  }),
                })}
              >
                {t.generated}
              </Checkbox>
            </div>
          </FormField>
        </fieldset>

        <FormAlertBoxes result={submitState.result} />

        {!chat.archived && (
          <div className="flex flex-row justify-end mt-4 pt-4">
            <SaveButton
              disabled={!isDirty}
              loading={submitState.loading}
              type="submit"
            />
          </div>
        )}
      </form>

      {(
        chat.archived
          ? <ChatConfigUnarchive chat={chat} />
          : <ChatConfigArchive chat={chat} />
      )}
    </CollapsiblePanel>
  );
}
