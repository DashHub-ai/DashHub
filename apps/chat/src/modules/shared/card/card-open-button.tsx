import clsx from 'clsx';
import { ExternalLinkIcon } from 'lucide-react';

import { useI18n } from '~/i18n';

type Props = {
  loading?: boolean;
  onClick: VoidFunction;
};

export function CardOpenButton({ onClick, loading }: Props) {
  const t = useI18n().pack;

  return (
    <a
      href=""
      className={clsx(
        'uk-button uk-button-secondary uk-button-small',
        loading && 'uk-disabled opacity-50',
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {loading && (
        <span
          className="mr-2 uk-icon uk-spinner"
          role="status"
          uk-spinner="ratio: 0.54"
        />
      )}
      <ExternalLinkIcon size={16} className="mr-2" />
      {t.buttons.open}
    </a>
  );
}
