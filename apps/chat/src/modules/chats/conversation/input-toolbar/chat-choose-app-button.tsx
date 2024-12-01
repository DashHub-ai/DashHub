import clsx from 'clsx';
import { pipe } from 'fp-ts/lib/function';
import { Plus } from 'lucide-react';

import type { SdkAppT, SdkTableRowWithIdT } from '@llm/sdk';

import { tapTaskOption } from '@llm/commons';
import { useI18n } from '~/i18n';
import { useChooseAppModal } from '~/modules/apps/choose-app';

type Props = {
  disabled?: boolean;
  selectedApps?: SdkTableRowWithIdT[];
  onSelect?: (app: SdkAppT) => void;
};

export function ChatChooseAppButton({ disabled, selectedApps, onSelect }: Props) {
  const t = useI18n().pack.chat.actions;
  const { showAsOptional } = useChooseAppModal();

  const onShowModal = pipe(
    showAsOptional({
      selectedApps,
    }),
    tapTaskOption(onSelect || (() => {})),
  );

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onShowModal}
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1 rounded-md font-medium text-xs',
        'text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500',
        'border border-gray-200',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <Plus size={16} />
      <span>{t.addApp}</span>
    </button>
  );
}
