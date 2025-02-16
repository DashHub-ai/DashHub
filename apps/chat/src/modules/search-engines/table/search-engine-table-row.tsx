import { pipe } from 'fp-ts/lib/function';

import { formatDate, tapTaskEither, tapTaskOption } from '@llm/commons';
import { type SdkSearchSearchEngineItemT, useSdkForLoggedIn } from '@llm/sdk';
import { ArchivedBadge, BooleanBadge, EllipsisCrudDropdownButton } from '~/ui';

import { useSearchEngineUpdateModal } from '../form/update';

type Props = {
  item: SdkSearchSearchEngineItemT;
  onUpdated: VoidFunction;
};

export function SearchEnginesTableRow({ item, onUpdated }: Props) {
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useSearchEngineUpdateModal();

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
              sdks.dashboard.searchEngines.archive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
          {...item.archived && {
            onUnarchive: pipe(
              sdks.dashboard.searchEngines.unarchive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
        />
      </td>
    </tr>
  );
}
