import type { CanBePromise } from '@llm/commons';
import type { SdkPermissionT } from '@llm/sdk';

import {
  CancelButton,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { useShareResourceForm } from './use-share-resource-form';

export type ShareResourceFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkPermissionT[];
    onSubmit: (value: SdkPermissionT[]) => CanBePromise<void>;
  };

export function ShareResourceFormModal(
  {
    defaultValue,
    onSubmit,
    onClose,
    ...props
  }: ShareResourceFormModalProps,
) {
  const t = useI18n().pack.projects.form;
  const { handleSubmitEvent, submitState } = useShareResourceForm({
    defaultValue,
    onSubmit,
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
      AVC
    </Modal>
  );
}
