import type { ReactNode } from 'react';

import clsx from 'clsx';
import { flow } from 'fp-ts/lib/function';
import { ExternalLinkIcon, PencilIcon, StarIcon, TrashIcon, WandSparklesIcon } from 'lucide-react';

import { formatDate, runTask, tapTaskOption } from '@llm/commons';
import { type SdkAppT, useSdkForLoggedIn } from '@llm/sdk';
import { useArchiveWithNotifications } from '@llm/ui';
import { useI18n } from '~/i18n';
import { useAppUpdateModal } from '~/modules/apps-creator';
import { useCreateChatWithInitialApp } from '~/modules/chats/conversation/hooks';

import { useFavoriteApps } from '../favorite';

export type AppCardProps = {
  app: SdkAppT;
  ctaButton?: ReactNode;
  onAfterEdit?: VoidFunction;
  onAfterArchive?: VoidFunction;
};

export function AppCard({ app, ctaButton, onAfterEdit, onAfterArchive }: AppCardProps) {
  const t = useI18n().pack;
  const { isFavorite, toggle } = useFavoriteApps();
  const { showAsOptional } = useAppUpdateModal();

  const { sdks } = useSdkForLoggedIn();
  const favorite = isFavorite(app);
  const [createApp, createStatus] = useCreateChatWithInitialApp();

  const onShowEdit = flow(
    showAsOptional,
    tapTaskOption(onAfterEdit ?? (() => {})),
    runTask,
  );

  const [onArchive, archiveStatus] = useArchiveWithNotifications(
    sdks.dashboard.apps.archive(app.id),
  );

  return (
    <div className="relative flex flex-col bg-white shadow-sm hover:shadow-md p-4 pb-2 border border-border/50 rounded-lg transition-shadow">
      {!app.archived && (
        <button
          type="button"
          className={clsx(
            'top-4 right-4 absolute',
            favorite
              ? 'text-yellow-500 hover:text-yellow-600'
              : 'text-muted-foreground hover:text-primary',
          )}
          title={t.apps.favorites[favorite ? 'remove' : 'add']}
          aria-label={t.apps.favorites[favorite ? 'remove' : 'add']}
          onClick={() => {
            toggle(app);
          }}
        >
          <StarIcon
            size={20}
            {...favorite
              ? {
                  strokeWidth: 0,
                  fill: 'currentColor',
                }
              : {}}
          />
        </button>
      )}

      <div className="flex items-center gap-2 mb-2">
        <div className="text-muted-foreground">
          <WandSparklesIcon size={16} />
        </div>
        <h3 className="font-medium">{app.name}</h3>
      </div>

      <p className="flex-1 mb-4 line-clamp-2 text-muted-foreground text-sm">
        {app.description}
      </p>

      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground text-xs">
            {formatDate(app.updatedAt)}
          </div>
        </div>

        {ctaButton || (
          <a
            href=""
            className={clsx(
              'uk-button uk-button-secondary uk-button-small',
              createStatus.isLoading && 'uk-disabled opacity-50',
            )}
            onClick={(e) => {
              e.preventDefault();
              void createApp(app);
            }}
          >
            {createStatus.isLoading && (
              <span
                className="mr-2 uk-icon uk-spinner"
                role="status"
                uk-spinner="ratio: 0.54"
              />
            )}

            <ExternalLinkIcon size={16} className="mr-2" />
            {t.buttons.open}
          </a>
        )}
      </div>

      {!ctaButton && !app.archived && (
        <>
          <div className="-mx-4 my-2 bg-border/50 h-px" />
          <div className="flex flex-row gap-2 px-1">
            <button
              type="button"
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-md text-xs transition-colors"
              onClick={() => {
                void onShowEdit({ app });
              }}
            >
              <PencilIcon size={12} />
              {t.buttons.edit}
            </button>

            <button
              type="button"
              disabled={archiveStatus.loading}
              className={clsx(
                'flex items-center gap-1.5 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-red-600 text-xs transition-colors',
                archiveStatus.loading && 'opacity-50',
              )}
              onClick={() => {
                void onArchive().then(() => onAfterArchive?.());
              }}
            >
              <TrashIcon size={12} />
              {t.buttons.archive}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
