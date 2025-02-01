import { useControlStrict } from '@under-control/forms';

import type { SdkUserListItemT } from '@llm/sdk';

import { findItemById, rejectById } from '@llm/commons';
import { useI18n } from '~/i18n';
import { Modal, type ModalProps, ModalTitle, SaveButton, SelectRecordButton } from '~/ui';

import { UsersTableContainer } from '../table';

export type ChooseUsersModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    selectedUsers?: SdkUserListItemT[];
    onSelected: (users: SdkUserListItemT[]) => void;
  };

export function ChooseUsersModal(
  {
    selectedUsers,
    onSelected,
    onClose,
    ...props
  }: ChooseUsersModalProps,
) {
  const t = useI18n().pack.users.chooseUsersModal;
  const { value, setValue } = useControlStrict<SdkUserListItemT[]>({
    defaultValue: selectedUsers || [],
  });

  const renderCTARowButton = (user: SdkUserListItemT) => {
    const selected = !!findItemById(user.id)(value);

    return (
      <div className="flex flex-row justify-center w-[100px]">
        <SelectRecordButton
          className="uk-button-small"
          selected={selected}
          onClick={() => {
            const rejectedUsers = rejectById(user.id)(value);

            if (selected) {
              setValue({ value: rejectedUsers });
            }
            else {
              setValue({ value: [user, ...rejectedUsers] });
            }
          }}
        />
      </div>
    );
  };

  return (
    <Modal
      {...props}
      formProps={{
        className: 'w-[1200px]',
      }}
      onClose={onClose}
      header={(
        <ModalTitle>
          {t.title}
        </ModalTitle>
      )}
      footer={(
        <SaveButton
          type="button"
          withIcon={false}
          loading={false}
          disabled={value === selectedUsers}
          onClick={() => {
            onSelected(value);
          }}
        />
      )}
    >
      <UsersTableContainer
        itemPropsFn={item => ({
          ctaButton: renderCTARowButton(item),
        })}
      />
    </Modal>
  );
}
