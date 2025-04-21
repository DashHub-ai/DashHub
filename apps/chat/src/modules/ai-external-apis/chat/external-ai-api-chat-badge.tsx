import clsx from 'clsx';
import { ZapIcon } from 'lucide-react';
import { memo, useMemo } from 'react';

import type { SdkTableRowIdT } from '@llm/sdk';

import { useCachedExternalAIApiLookup } from '../use-cached-external-api-lookup';

const colorVariants = [
  { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-500', hover: 'hover:bg-blue-200' },
  { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-500', hover: 'hover:bg-green-200' },
  { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-500', hover: 'hover:bg-purple-200' },
  { bg: 'bg-pink-100', text: 'text-pink-700', icon: 'text-pink-500', hover: 'hover:bg-pink-200' },
  { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'text-orange-500', hover: 'hover:bg-orange-200' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'text-indigo-500', hover: 'hover:bg-indigo-200' },
];

type Props = {
  id: SdkTableRowIdT;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const ExternalApiChatBadge = memo(({ id, onClick, className, disabled }: Props) => {
  const value = useCachedExternalAIApiLookup(id);

  const colors = useMemo(() => {
    const hash = String(id).split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return colorVariants[hash % colorVariants.length];
  }, [id]);

  const hasLogo = value.status === 'success' && value.data?.logo && value.data.logo.publicUrl;

  return (
    <span
      onClick={onClick}
      className={clsx(
        'inline-flex relative items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-all',
        colors.bg,
        colors.text,
        {
          'opacity-50 cursor-not-allowed': disabled,
          [colors.hover]: onClick && !disabled,
          'cursor-pointer hover:scale-105 active:scale-95': onClick && !disabled,
        },
        className,
      )}
    >
      {hasLogo
        ? (
            <img
              src={value.data!.logo!.publicUrl}
              alt={`${value.data!.name} logo`}
              className="w-3 h-3 object-contain"
            />
          )
        : (
            <ZapIcon size={12} className={colors.icon} />
          )}
      <span>{value.status === 'success' ? value.data?.name : '...'}</span>
    </span>
  );
});
