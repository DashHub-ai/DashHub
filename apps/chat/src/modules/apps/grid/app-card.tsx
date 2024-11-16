import { ExternalLinkIcon, StarIcon, WandSparklesIcon } from 'lucide-react';

import type { SdkAppT } from '@llm/sdk';

import { formatDate } from '@llm/commons';
import { useI18n } from '~/i18n';

type AppCardProps = {
  app: SdkAppT;
};

export function AppCard({ app }: AppCardProps) {
  const t = useI18n().pack;
  const favorite = app.name.includes('Analyzer');

  return (
    <div className="relative flex flex-col bg-white shadow-sm hover:shadow-md p-4 pb-2 border border-border/50 rounded-lg transition-shadow">
      <button
        type="button"
        className={`top-4 right-4 absolute ${
          favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-primary'
        }`}
        title={t.apps.favorites[favorite ? 'remove' : 'add']}
        aria-label={t.apps.favorites[favorite ? 'remove' : 'add']}
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
        <div className="text-muted-foreground text-xs">
          {formatDate(app.updatedAt)}
        </div>

        <a href="#" className="uk-button uk-button-secondary uk-button-small">
          <ExternalLinkIcon size={16} className="mr-2" />
          {t.buttons.open}
        </a>
      </div>
    </div>
  );
}
