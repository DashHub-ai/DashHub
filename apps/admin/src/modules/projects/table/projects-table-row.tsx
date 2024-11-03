import { pipe } from 'fp-ts/lib/function';
import { Link } from 'wouter';

import { formatDate, tapTaskEither, tapTaskOption } from '@llm/commons';
import { type SdkSearchProjectItemT, useSdkForLoggedIn } from '@llm/sdk';
import { ArchivedBadge, EllipsisCrudDropdownButton } from '@llm/ui';
import { useSitemap } from '~/routes';

import { useProjectUpdateModal } from '../form/update';

type Props = {
  item: SdkSearchProjectItemT;
  onUpdated: VoidFunction;
};

export function ProjectsTableRow({ item, onUpdated }: Props) {
  const sitemap = useSitemap();
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useProjectUpdateModal();

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
                project: item,
              }),
              tapTaskOption(onUpdated),
            ),
            onArchive: pipe(
              sdks.dashboard.projects.archive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
          {...item.archived && {
            onUnarchive: pipe(
              sdks.dashboard.projects.unarchive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
        />
      </td>
    </tr>
  );
}
