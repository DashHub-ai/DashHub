import { CheckIcon, CopyIcon } from 'lucide-react';
import { memo, useState } from 'react';

import { timeout } from '@dashhub/commons';
import { useIsMountedRef } from '@dashhub/commons-front';
import { useI18n } from '~/i18n';

import type { AIStreamObservable } from '../../hooks';

import { ToolbarSmallActionButton } from '../buttons';

type Props = {
  disabled?: boolean;
  content: string | AIStreamObservable;
};

export const ChatMesssageCopyAction = memo(({ disabled, content }: Props) => {
  const t = useI18n().pack.chat.actions;
  const [copied, setCopied] = useState(false);
  const isMountedRef = useIsMountedRef();

  const onCopy = async () => {
    const serializedContent = (
      typeof content === 'string'
        ? content
        : content.getSnapshot().content
    );

    setCopied(true);

    await navigator.clipboard.writeText(serializedContent);
    await timeout(1000);

    if (isMountedRef.current) {
      setCopied(false);
    }
  };

  const title = copied ? t.copied : t.copy;
  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <ToolbarSmallActionButton
      disabled={disabled}
      title={title}
      icon={<Icon size={14} className="text-gray-500" />}
      onClick={onCopy}
    />
  );
});
