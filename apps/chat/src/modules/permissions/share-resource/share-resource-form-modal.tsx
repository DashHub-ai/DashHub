import type { CanBePromise } from '@llm/commons';
import type { SdkPermissionT, SdkUserListItemT } from '@llm/sdk';

import {
  CancelButton,
  FormSpinnerCTA,
  Modal,
  type ModalProps,
  ModalTitle,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { SearchUsersGroupsInput } from './autocomplete';
import { ResourcePermissionsList } from './list';
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
  const { handleSubmitEvent, submitState, value, setValue } = useShareResourceForm({
    defaultValue,
    onSubmit,
  });

  const onSelected = (permission: SdkPermissionT) => {
    setValue({
      value: [permission, ...value],
    });
  };

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
      <div className="flex flex-col space-y-4">
        <SearchUsersGroupsInput onSelected={onSelected} />
        <ResourcePermissionsList
          creator={creator}
          permissions={value}
          onChange={(newValue) => {
            setValue({ value: newValue });
          }}
        />
      </div>
    </Modal>
  );
}
