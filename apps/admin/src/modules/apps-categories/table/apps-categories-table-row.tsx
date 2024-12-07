import { pipe } from 'fp-ts/lib/function';
import { Link } from 'wouter';

import { formatDate, tapTaskEither, tapTaskOption } from '@llm/commons';
import { type SdkSearchAppCategoryItemT, useSdkForLoggedIn } from '@llm/sdk';
import { ArchivedBadge, EllipsisCrudDropdownButton } from '@llm/ui';
import { useSitemap } from '~/routes';

import { useAppCategoryUpdateModal } from '../form/update';

type Props = {
  item: SdkSearchAppCategoryItemT;
  onUpdated: VoidFunction;
};

export function AppsCategoriesTableRow({ item, onUpdated }: Props) {
  const sitemap = useSitemap();
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useAppCategoryUpdateModal();

  const { parentCategory } = item;

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.description || '-'}</td>
      <td>
        {parentCategory
          ? (
              <Link
                className="uk-link"
                href={sitemap.forceRedirect.generate(
                  sitemap.apps.categories.show(parentCategory.id),
                )}
                replace
              >
                {parentCategory.name}
              </Link>
            )
          : '-'}
      </td>
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
