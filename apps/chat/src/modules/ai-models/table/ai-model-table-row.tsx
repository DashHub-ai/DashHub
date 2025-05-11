import { pipe } from 'fp-ts/lib/function';

import { formatDate, tapTaskEither, tapTaskOption } from '@dashhub/commons';
import { type SdkSearchAIModelItemT, useSdkForLoggedIn } from '@dashhub/sdk';
import { ArchivedBadge, BooleanBadge, EllipsisCrudDropdownButton } from '~/ui';

import { useAIModelUpdateModal } from '../form/update';

type Props = {
  item: SdkSearchAIModelItemT;
  onUpdated: VoidFunction;
};

export function AIModelsTableRow({ item, onUpdated }: Props) {
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useAIModelUpdateModal();

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.description || '-'}</td>
      <td><BooleanBadge value={item.default} /></td>
      <td><ArchivedBadge archived={item.archived} /></td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{formatDate(item.updatedAt)}</td>
      <td>
        <EllipsisCrudDropdownButton
          {...!item.archived && {
            onUpdate: pipe(
              updateModal.showAsOptional({
                app: item,
              }),
              tapTaskOption(onUpdated),
            ),
            onArchive: pipe(
              sdks.dashboard.aiModels.archive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
          {...item.archived && {
            onUnarchive: pipe(
              sdks.dashboard.aiModels.unarchive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
        />
      </td>
    </tr>
  );
}
