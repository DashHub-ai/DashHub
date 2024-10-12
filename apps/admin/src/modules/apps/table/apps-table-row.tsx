import { pipe } from 'fp-ts/lib/function';
import { Link } from 'wouter';

import { formatDate, tapTaskEither, tapTaskOption } from '@llm/commons';
import { type SdkSearchAppItemT, useSdkForLoggedIn } from '@llm/sdk';
import { ArchivedBadge, EllipsisCrudDropdownButton } from '~/components';
import { useSitemap } from '~/routes';

import { useAppUpdateModal } from '../form/update';

type Props = {
  item: SdkSearchAppItemT;
  onUpdated: VoidFunction;
};

export function AppsTableRow({ item, onUpdated }: Props) {
  const sitemap = useSitemap();
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useAppUpdateModal();

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>
        <Link
          className="uk-link"
          href={sitemap.organizations.show(item.organization.id)}
        >
          {item.organization.name}
        </Link>
      </td>
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
              sdks.dashboard.apps.archive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
          {...item.archived && {
            onUnarchive: pipe(
              sdks.dashboard.apps.unarchive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
        />
      </td>
    </tr>
  );
}
