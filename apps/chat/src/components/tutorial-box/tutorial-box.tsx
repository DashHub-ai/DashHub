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

type TutorialBoxVariant = 'amber' | 'blue' | 'green' | 'red';

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
  green: {
    gradient: 'from-green-100 to-emerald-100',
    border: 'border-green-300',
    icon: 'text-green-300',
  },
  red: {
    gradient: 'from-red-50 to-rose-50',
    border: 'border-red-200',
    icon: 'text-red-200',
  },
};

const BUTTON_STYLES: Record<TutorialBoxVariant, string> = {
  amber: 'bg-amber-100 hover:bg-amber-200 text-amber-700',
  blue: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  green: 'bg-green-200 hover:bg-green-300 text-green-800',
  red: 'bg-red-100 hover:bg-red-200 text-red-700',
};

type TutorialBoxProps = PropsWithChildren & {
  className?: string;
  variant?: TutorialBoxVariant;
  withHideToolbar?: boolean;
  showIconAsBackground?: boolean;
  title: string;
  icon: string;
  id: string;
};

export function TutorialBox(
  {
    variant = 'amber',
    title,
    icon,
    showIconAsBackground,
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
        'relative bg-gradient-to-r mb-6 p-4 border rounded-lg max-w-4xl overflow-hidden',
        !showIconAsBackground && 'pr-[90px]',
        styles.gradient,
        styles.border,
        className,
      )}
    >
      <div
        className={clsx(
          'top-1/2 right-4 absolute ml-10 text-[80px] -translate-y-1/2',
          styles.icon,
          showIconAsBackground ? 'opacity-5' : 'opacity-35',
        )}
      >
        {icon}
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
              BUTTON_STYLES[variant],
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
