import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { Share2Icon } from 'lucide-react';

import type { SdkPermissionT } from '@llm/sdk';

import { type TaggedError, tapTaskEitherError } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { FormSpinnerCTA, useSaveErrorNotification } from '@llm/ui';
import { useI18n } from '~/i18n';

import { useShareResourceModal } from './use-share-resource-modal';

type Props = {
  className?: string;
  defaultValue: SdkPermissionT[];
  onSubmit: (value: SdkPermissionT[]) => TE.TaskEither<TaggedError<string>, unknown>;
};

export function ShareResourceButton(
  {
    className,
    defaultValue,
    onSubmit,
  }: Props,
) {
  const t = useI18n().pack.permissions.shareResource;
  const modal = useShareResourceModal();
  const showErrorNotification = useSaveErrorNotification();

  const [onOpen, submitState] = useAsyncCallback(
    pipe(
      modal.showAsOptional({
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
      loading={submitState.isLoading}
      onClick={onOpen}
    >
      <Share2Icon size={16} className="mr-2" />

      {t.share}
    </FormSpinnerCTA>
  );
}
