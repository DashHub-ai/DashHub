import clsx from 'clsx';
import { PlusCircleIcon } from 'lucide-react';

import { useI18n } from '~/i18n';

import { useStartChatForm } from '../start-chat/use-start-chat-form';

type Props = {
  className?: string;
};

export function NewChatSidebarButton({ className }: Props) {
  const t = useI18n().pack;
  const { form } = useStartChatForm({
    project: null,
    defaultValue: {
      content: t.prompts.hello,
    },
  });

  return (
    <button
      type="button"
      disabled={form.submitState.loading}
      className={clsx(
        'flex justify-center items-center gap-2 px-4 py-2.5 rounded-md w-full font-semibold text-sm transition-all duration-200',
        'text-slate-800 hover:bg-slate-100',
        'border border-slate-200',
        form.submitState.loading && 'opacity-50 pointer-events-none',
        className,
      )}
      onClick={form.submit}
    >
      <PlusCircleIcon
        size={18}
        className="top-[1px] relative"
      />

      <span>{t.sidebar.startChat}</span>
    </button>
  );
}
