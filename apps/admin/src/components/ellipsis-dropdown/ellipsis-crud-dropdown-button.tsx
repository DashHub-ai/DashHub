import * as TE from 'fp-ts/lib/TaskEither';

import { rejectFalsyItems } from '@llm/commons';
import { useI18n } from '~/i18n';

import {
  type ArchiveTE,
  type UnarchiveTE,
  useArchiveWithNotifications,
  useUnarchiveWithNotifications,
} from '../predefined';
import {
  EllipsisDropdownButton,
  type EllipsisDropdownButtonProps,
  type EllipsisDropdownItem,
} from './ellipsis-dropdown-button';

type Props = Omit<EllipsisDropdownButtonProps, 'items'> & {
  onUpdate?: VoidFunction;
  onArchive?: ArchiveTE;
  onUnarchive?: UnarchiveTE;
  onDelete?: VoidFunction;
};

export function EllipsisCrudDropdownButton(
  {
    onUpdate,
    onArchive,
    onUnarchive,
    onDelete,
    ...props
  }: Props,
) {
  const t = useI18n().pack.buttons;

  const [unarchive] = useUnarchiveWithNotifications(
    onUnarchive ?? TE.of(undefined),
  );

  const [archive] = useArchiveWithNotifications(
    onArchive ?? TE.of(undefined),
  );

  const items: EllipsisDropdownItem[] = rejectFalsyItems([
    onUnarchive && {
      id: 'unarchive',
      name: t.unarchive,
      onClick: unarchive,
    },
    onUpdate && {
      id: 'edit',
      name: t.edit,
      onClick: onUpdate,
    },

    onArchive && {
      id: 'archive',
      name: t.archive,
      onClick: archive,
    },

    onDelete && {
      id: 'delete',
      name: 'Delete',
      onClick: onDelete,
    },
  ]);

  return (
    <EllipsisDropdownButton items={items} {...props} />
  );
}
