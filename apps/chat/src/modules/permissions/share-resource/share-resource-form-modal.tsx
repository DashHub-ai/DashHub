import type { CanBePromise } from '@llm/commons';
import type { SdkPermissionT } from '@llm/sdk';

import {
  CancelButton,
  FormSpinnerCTA,
  Modal,
  type ModalProps,
  ModalTitle,
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
  const t = useI18n().pack.permissions.modal;
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
          {t.title}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={submitState.loading} onClick={onClose} />
          <FormSpinnerCTA {...props} loading={submitState.loading}>
            {t.submit}
          </FormSpinnerCTA>
        </>
      )}
    >
      AVC
    </Modal>
  );
}
