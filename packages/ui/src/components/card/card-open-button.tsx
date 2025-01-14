import clsx from 'clsx';
import { ExternalLinkIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useForwardedI18n } from '~/i18n';

type Props = {
  href?: string;
  loading?: boolean;
  onClick?: VoidFunction;
};

export function CardOpenButton({ href, onClick, loading }: Props) {
  const t = useForwardedI18n().pack;
  const className = clsx(
    'uk-button uk-button-secondary uk-button-small',
    loading && 'uk-disabled opacity-50',
  );

  const content = (
    <>
      {loading && (
        <span
          className="mr-2 uk-icon uk-spinner"
          role="status"
          uk-spinner="ratio: 0.54"
        />
      )}
      <ExternalLinkIcon size={16} className="mr-2" />
      {t.buttons.open}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href=""
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      {content}
    </a>
  );
}
