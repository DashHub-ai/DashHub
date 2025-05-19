import { pipe } from 'fp-ts/lib/function';

import { formatDate, tapTaskEither, tapTaskOption } from '@dashhub/commons';
import { type SdkSearchAppCategoryItemT, useSdkForLoggedIn } from '@dashhub/sdk';
import { EllipsisCrudDropdownButton } from '~/ui';

import { useAppCategoryUpdateModal } from '../form/update';

type Props = {
  item: SdkSearchAppCategoryItemT;
  onUpdated: VoidFunction;
};

export function AppsCategoriesTableRow({ item, onUpdated }: Props) {
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useAppCategoryUpdateModal();

  const { parentCategory } = item;

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.description || '-'}</td>
      <td>{parentCategory?.name ?? '-'}</td>
      <td>{formatDate(item.updatedAt)}</td>
      <td>
        <EllipsisCrudDropdownButton
          {...!item.archived && {
            onUpdate: pipe(
              updateModal.showAsOptional({
                category: item,
              }),
              tapTaskOption(onUpdated),
            ),
            onArchive: pipe(
              sdks.dashboard.appsCategories.archive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
          {...item.archived && {
            onUnarchive: pipe(
              sdks.dashboard.appsCategories.unarchive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
        />
      </td>
    </tr>
  );
}
