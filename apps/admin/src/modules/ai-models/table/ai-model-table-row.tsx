import { pipe } from 'fp-ts/lib/function';
import { Link } from 'wouter';

import { formatDate, tapTaskEither, tapTaskOption } from '@llm/commons';
import { type SdkSearchAIModelItemT, useSdkForLoggedIn } from '@llm/sdk';
import { ArchivedBadge, BooleanBadge, EllipsisCrudDropdownButton } from '@llm/ui';
import { useSitemap } from '~/routes';

import { useAIModelUpdateModal } from '../form/update';

type Props = {
  item: SdkSearchAIModelItemT;
  onUpdated: VoidFunction;
};

export function AIModelsTableRow({ item, onUpdated }: Props) {
  const sitemap = useSitemap();
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useAIModelUpdateModal();

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.description || '-'}</td>
      <td>
        <Link
          className="uk-link"
          href={sitemap.organizations.show(item.organization.id)}
        >
          {item.organization.name}
        </Link>
      </td>
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
