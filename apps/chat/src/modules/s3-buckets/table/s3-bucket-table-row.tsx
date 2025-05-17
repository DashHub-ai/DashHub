import { pipe } from 'fp-ts/lib/function';

import { formatDate, tapTaskEither, tapTaskOption } from '@dashhub/commons';
import { type SdkSearchS3BucketItemT, useSdkForLoggedIn } from '@dashhub/sdk';
import { ArchivedBadge, BooleanBadge, EllipsisCrudDropdownButton } from '~/ui';

import { useS3BucketUpdateModal } from '../form/update';

type Props = {
  item: SdkSearchS3BucketItemT;
  onUpdated: VoidFunction;
};

export function S3BucketsTableRow({ item, onUpdated }: Props) {
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useS3BucketUpdateModal();

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.accessKeyId}</td>
      <td><BooleanBadge value={item.default} /></td>
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
              sdks.dashboard.s3Buckets.archive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
          {...item.archived && {
            onUnarchive: pipe(
              sdks.dashboard.s3Buckets.unarchive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
        />
      </td>
    </tr>
  );
}
