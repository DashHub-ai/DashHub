import {
  BrainCircuitIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  SparklesIcon,
  StarIcon,
} from 'lucide-react';

import type { SdkExpertT } from '@llm/sdk';

import { formatDate } from '@llm/commons';
import { useI18n } from '~/i18n';

type ExpertCardProps = {
  expert: SdkExpertT;
};

export function ExpertCard({ expert }: ExpertCardProps) {
  const t = useI18n().pack;
  const favorite = expert.name.includes('Analyzer');

  return (
    <div className="relative flex flex-col bg-white shadow-sm hover:shadow-md p-4 pb-2 border border-border/50 rounded-lg transition-shadow">
      <button
        type="button"
        className={`top-4 right-4 absolute ${
          favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-primary'
        }`}
        title={t.experts.favorites[favorite ? 'remove' : 'add']}
        aria-label={t.experts.favorites[favorite ? 'remove' : 'add']}
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
          <GraduationCapIcon size={16} />
        </div>
        <h3 className="font-medium">{expert.name}</h3>
      </div>
      <p className="flex-1 mb-2 line-clamp-2 text-muted-foreground text-sm">
        {expert.description}
      </p>

      <div className="flex gap-1 mb-3">
        {expert.aiModels.map((model, index) => (
          <span
            key={model.id}
            className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 text-xs"
          >
            {index % 2 ? <SparklesIcon size={12} /> : <BrainCircuitIcon size={12} />}
            {model.name}
          </span>
        ))}
      </div>

      <div className="flex flex-row justify-between items-center">
        <div className="text-muted-foreground text-xs">
          {formatDate(expert.updatedAt)}
        </div>

        <a href="#" className="uk-button uk-button-secondary uk-button-small">
          <ExternalLinkIcon size={16} className="mr-2" />
          {t.buttons.open}
        </a>
      </div>
    </div>
  );
}
