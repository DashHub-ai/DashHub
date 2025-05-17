import type { CanBePromise } from '@dashhub/commons';
import type { SdkPermissionT, SdkUserListItemT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import {
  CancelButton,
  FormSpinnerCTA,
  Modal,
  type ModalProps,
  ModalTitle,
} from '~/ui';

import { ShareResourceFormGroup } from './share-resource-form-group';
import { useShareResourceForm } from './use-share-resource-form';

export type ShareResourceFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkPermissionT[];
    creator: SdkUserListItemT;
    onSubmit: (value: SdkPermissionT[]) => CanBePromise<void>;
  };

export function ShareResourceFormModal(
  {
    creator,
    defaultValue,
    onSubmit,
    onClose,
    ...props
  }: ShareResourceFormModalProps,
) {
  const t = useI18n().pack.permissions.modal;
  const { handleSubmitEvent, submitState, bind } = useShareResourceForm({
    defaultValue,
    onSubmit,
  });

  return (
    <Modal
      {...props}
      onClose={onClose}
      formProps={{
        className: 'w-[550px]',
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
          <FormSpinnerCTA loading={submitState.loading}>
            {t.submit}
          </FormSpinnerCTA>
        </>
      )}
    >
      <ShareResourceFormGroup creator={creator} {...bind.entire()} />
    </Modal>
  );
}
