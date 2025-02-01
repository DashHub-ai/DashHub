import { controlled, useControlStrict } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';

import type { SdkOffsetPaginationInputT, SdkUserListItemT } from '@llm/sdk';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';
import { useChooseUsersModal } from '~/modules/users/choose-users';
import { AddButton, EllipsisCrudDropdownButton, FormField, PaginatedTable } from '~/ui';

export const GroupUsersSelectTable = controlled<SdkUserListItemT[]>(({ control: { value, setValue } }) => {
  const { pack } = useI18n();
  const t = pack.table.columns;

  const pagination = useControlStrict<SdkOffsetPaginationInputT>({
    defaultValue: {
      offset: 0,
      limit: 10,
    },
  });

  const chooseUsersModal = useChooseUsersModal();

  const [onShowChooseUsersModal, choosingUsersState] = useAsyncCallback(
    pipe(
      chooseUsersModal.showAsOptional({
        selectedUsers: value,
      }),
      tapTaskOption((users) => {
        setValue({
          value: users,
        });
      }),
    ),
  );

  const paginationOutput = {
    total: Math.min(value.length, pagination.value.limit),
    items: value.slice(
      pagination.value.offset,
      pagination.value.offset + pagination.value.limit,
    ),
  };

  return (
    <FormField
      className="uk-margin"
      label={pack.usersGroups.form.fields.users.label}
    >
      <AddButton
        className="mt-1 uk-button-secondary uk-button-small"
        loading={choosingUsersState.isLoading}
        onClick={onShowChooseUsersModal}
      />

      {value.length > 0 && (
        <PaginatedTable
          className="mt-3"
          spaced={false}
          result={paginationOutput}
          pagination={pagination.bind.entire()}
          columns={[
            { id: 'id', name: t.id, className: 'uk-table-shrink' },
            { id: 'email', name: t.email, className: 'uk-table-expand' },
            { id: 'actions', name: t.actions, className: 'uk-table-shrink' },
          ]}
          footerProps={{
            centered: true,
            withNthToNthOf: false,
            withPageNumber: false,
            withPageSizeSelector: false,
          }}
        >
          {({ item }) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.email}</td>
              <td>
                <EllipsisCrudDropdownButton
                  onDelete={() => {
                    setValue({
                      value: value.filter(user => user.id !== item.id),
                    });
                  }}
                />
              </td>
            </tr>
          )}
        </PaginatedTable>
      )}

      {!value.length && (
        <GhostPlaceholder spaced={false} className="pt-6" />
      )}
    </FormField>
  );
});
