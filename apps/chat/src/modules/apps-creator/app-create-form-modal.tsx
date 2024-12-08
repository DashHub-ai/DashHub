import type { SdkCreateAppInputT, SdkCreateAppOutputT } from '@llm/sdk';

import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  FormField,
  Input,
  Modal,
  type ModalProps,
  ModalTitle,
  TextArea,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { AppsCategoriesSearchSelect } from '../apps-categories';
import { useAppCreateForm } from './use-app-create-form';

export type AppCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkCreateAppInputT;
    onAfterSubmit?: (result: SdkCreateAppOutputT) => void;
  };

export function AppCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: AppCreateFormModalProps,
) {
  const t = useI18n().pack.appsCreator;
  const { handleSubmitEvent, validator, submitState, bind, value } = useAppCreateForm({
    defaultValue,
    onAfterSubmit,
  });

  return (
    <Modal
      {...props}
      isOverflowVisible
      onClose={onClose}
      formProps={{
        onSubmit: handleSubmitEvent,
      }}
      header={(
        <ModalTitle>
          {t.title}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={submitState.loading} onClick={onClose} />
          <CreateButton loading={submitState.loading} type="submit" />
        </>
      )}
    >
      <FormField
        className="uk-margin"
        label={t.fields.category.label}
        {...validator.errors.extract('category')}
      >
        <AppsCategoriesSearchSelect
          key={value.organization.id}
          {...bind.path('category')}
          filters={{
            archived: false,
            organizationIds: [value.organization.id],
          }}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.name.label}
        {...validator.errors.extract('name')}
      >
        <Input
          name="name"
          placeholder={t.fields.name.placeholder}
          required
          {...bind.path('name')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.description.label}
        {...validator.errors.extract('description')}
      >
        <TextArea
          name="description"
          placeholder={t.fields.description.placeholder}
          required
          {...bind.path('description')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.chatContext.label}
        {...validator.errors.extract('name')}
      >
        <TextArea
          name="chat-context"
          placeholder={t.fields.chatContext.placeholder}
          rows={3}
          required
          {...bind.path('chatContext')}
        />
      </FormField>

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
