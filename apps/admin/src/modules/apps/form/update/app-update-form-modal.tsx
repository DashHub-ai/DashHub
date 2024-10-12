import type { SdkAppT } from '@llm/sdk';

import {
  CancelButton,
  FormErrorAlert,
  FormField,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '~/components';
import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect } from '~/modules/organizations/controls/organizations-search-select';

import { AppSharedFormFields } from '../shared';
import { useAppUpdateForm } from './use-app-update-form';

export type AppUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    app: SdkAppT;
    onAfterSubmit?: VoidFunction;
  };

export function AppUpdateFormModal(
  {
    app,
    onAfterSubmit,
    onClose,
    ...props
  }: AppUpdateFormModalProps,
) {
  const t = useI18n().pack.modules.apps.form;
  const { handleSubmitEvent, validator, submitState, bind } = useAppUpdateForm({
    defaultValue: app,
    onAfterSubmit,
  });

  return (
    <Modal
      {...props}
      onClose={onClose}
      formProps={{
        onSubmit: handleSubmitEvent,
      }}
      header={(
        <ModalTitle>
          {t.title.edit}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={submitState.loading} onClick={onClose} />
          <UpdateButton loading={submitState.loading} type="submit" />
        </>
      )}
    >
      <FormField
        className="uk-margin"
        label={t.fields.organization.label}
      >
        <OrganizationsSearchSelect defaultValue={app.organization} required disabled />
      </FormField>

      <AppSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
