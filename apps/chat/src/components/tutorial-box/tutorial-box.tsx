import type { PropsWithChildren } from 'react';

import clsx from 'clsx';
import { flow } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { CheckIcon } from 'lucide-react';
import { z } from 'zod';

import { useLocalStorageObject } from '@llm/commons-front';
import { useI18n } from '~/i18n';

const STORAGE_KEY = 'tutorial-visibility';

const tutorialVisibilitySchema = z.record(z.boolean());

type TutorialBoxVariant = 'amber' | 'blue';

const VARIANT_STYLES: Record<TutorialBoxVariant, {
  gradient: string;
  border: string;
  icon: string;
}> = {
  amber: {
    gradient: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    icon: 'text-amber-200',
  },
  blue: {
    gradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    icon: 'text-blue-200',
  },
};

type TutorialBoxProps = PropsWithChildren & {
  className?: string;
  variant?: TutorialBoxVariant;
  withHideToolbar?: boolean;
  title: string;
  backgroundIcon: string;
  id: string;
};

export function TutorialBox(
  {
    variant = 'amber',
    title,
    backgroundIcon,
    withHideToolbar = true,
    className,
    children,
    id,
  }: TutorialBoxProps,
) {
  const t = useI18n().pack.components.tutorialBox;

  const styles = VARIANT_STYLES[variant];
  const visibility = useLocalStorageObject(STORAGE_KEY, {
    readBeforeMount: true,
    rerenderOnSet: true,
    schema: tutorialVisibilitySchema,
  });

  const getHiddenTutorials = flow(
    visibility.get,
    O.getOrElse(() => ({}) as Record<string, boolean>),
  );

  if (getHiddenTutorials()[id]) {
    return null;
  }

  const handleClose = () => {
    visibility.set({
      ...getHiddenTutorials(),
      [id]: true,
    });
  };

  return (
    <div
      className={clsx(
        'relative bg-gradient-to-r mb-6 p-4 pr-[90px] border rounded-lg max-w-4xl overflow-hidden',
        styles.gradient,
        styles.border,
        className,
      )}
    >
      <div className={`top-1/2 right-4 absolute opacity-35 ml-10 text-[80px] ${styles.icon} -translate-y-1/2`}>
        {backgroundIcon}
      </div>
      <h2 className="flex items-center gap-2 mb-2 font-semibold">
        {title}
      </h2>
      <div className="relative z-10 space-y-2 text-gray-600 text-sm">
        {children}
      </div>

      {withHideToolbar && (
        <div className="mt-6">
          <button
            onClick={handleClose}
            type="button"
            className={clsx(
              'flex flex-row px-4 py-2 rounded-md font-medium text-sm transition-colors',
              variant === 'amber' ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' : 'bg-blue-100 hover:bg-blue-200 text-blue-700',
            )}
          >
            <CheckIcon size={16} className="relative top-[2px] mr-2" />
            {t.gotIt}
          </button>
        </div>
      )}
    </div>
  );
}
