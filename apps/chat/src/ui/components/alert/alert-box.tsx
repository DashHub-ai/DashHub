import clsx from 'clsx';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { useTimeout } from '@dashhub/commons-front';

type AlertVariant = 'success' | 'error';

type Props = {
  children: ReactNode;
  variant: AlertVariant;
  className?: string;
  hideTimeout?: number | null;
};

const variantStyles = {
  success: 'bg-green-50 text-green-700 border-green-200',
  error: 'bg-red-50 text-red-700 border-red-200',
};

const variantIcons = {
  success: CheckCircle,
  error: AlertTriangle,
};

export function AlertBox({ hideTimeout = 5_000, children, variant, className = '' }: Props) {
  const Icon = variantIcons[variant];
  const [hidden, setHidden] = useState(false);

  useTimeout(
    () => {
      setHidden(true);
    },
    {
      time: hideTimeout || 0,
      pause: !hideTimeout,
      key: children,
    },
  );

  if (hidden) {
    return null;
  }

  return (
    <div
      className={clsx(
        'p-4 rounded-md transition-opacity animate-slideIn duration-300',
        'border text-sm',
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-1 items-center">
          <Icon className="flex-shrink-0 mr-3 w-5 h-5" />
          <div className="flex-1 text-center">{children}</div>
        </div>

        <button
          onClick={() => setHidden(true)}
          className="flex-shrink-0 hover:opacity-75 ml-3 transition-opacity"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
