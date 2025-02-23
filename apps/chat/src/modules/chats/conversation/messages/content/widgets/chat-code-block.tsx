import { CheckIcon, CopyIcon, PlayIcon, StopCircleIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useUpdateEffect } from '@llm/commons-front';
import { useI18n } from '~/i18n';

import { ChatCodeBrowserPreview } from './chat-code-browser-preview';
import { ChatCodeToolbarButton } from './chat-code-toolbar-button';

type ChatCodeBlockProps = {
  language?: string;
  children: string;
  initialShowPreview?: boolean;
};

export function ChatCodeBlock({ language, children, initialShowPreview }: ChatCodeBlockProps) {
  const t = useI18n().pack.chat.widgets.code;
  const containerRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(initialShowPreview || false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHtml = language === 'html';

  useUpdateEffect(() => {
    if (initialShowPreview && isHtml) {
      setShowPreview(true);
    }
  }, [initialShowPreview, isHtml]);

  return (
    <div
      className="relative bg-[#fafafa] mx-auto border border-gray-200 rounded-md max-w-[650px]"
      ref={containerRef}
    >
      <div className="flex justify-between items-center px-4 py-2">
        <span className="text-gray-600 text-xs">{language || 'plaintext'}</span>
        <div className="flex items-center gap-2">
          {isHtml && (
            <ChatCodeToolbarButton
              icon={showPreview ? StopCircleIcon : PlayIcon}
              label={showPreview ? t.stop : t.run}
              onClick={() => setShowPreview(!showPreview)}
            />
          )}

          <ChatCodeToolbarButton
            icon={copied ? CheckIcon : CopyIcon}
            label={copied ? t.copied : t.copy}
            onClick={handleCopy}
          />
        </div>
      </div>

      {!showPreview && (
        <div className="max-h-[500px] overflow-auto">
          <SyntaxHighlighter
            language={language || 'plaintext'}
            style={oneLight}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'inherit',
              minWidth: 'fit-content',
            }}
            PreTag="div"
          >
            {children}
          </SyntaxHighlighter>
        </div>
      )}

      {isHtml && showPreview && (
        <ChatCodeBrowserPreview content={children} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
