import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type { SdkPermissionT, SdkUserListItemT } from '@llm/sdk';

import { type TaggedError, tapTaskEitherError } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { FormSpinnerCTA, useSaveErrorNotification } from '@llm/ui';
import { useI18n } from '~/i18n';

import { PermissionsStatusIcon } from '../status';
import { useShareResourceModal } from './use-share-resource-modal';

type Props = {
  className?: string;
  defaultValue: SdkPermissionT[];
  creator: SdkUserListItemT;
  onSubmit: (value: SdkPermissionT[]) => TE.TaskEither<TaggedError<string>, unknown>;
};

export function ShareResourceButton(
  {
    className,
    defaultValue,
    creator,
    onSubmit,
  }: Props,
) {
  const t = useI18n().pack.permissions;
  const modal = useShareResourceModal();
  const showErrorNotification = useSaveErrorNotification();

  const [onOpen, submitState] = useAsyncCallback(
    pipe(
      modal.showAsOptional({
        creator,
        defaultValue,
      }),
      TE.fromTaskOption(() => TE.left(undefined)),
      TE.tap(flow(
        onSubmit,
        tapTaskEitherError(showErrorNotification),
      )),
    ),
  );

  return (
    <FormSpinnerCTA
      className={className}
      buttonTypeClass="uk-button-default"
      loading={submitState.isLoading}
      onClick={onOpen}
    >
      {!submitState.isLoading && (
        <PermissionsStatusIcon
          permissions={defaultValue}
          className="mr-2"
        />
      )}

      {t.share}
    </FormSpinnerCTA>
  );
}