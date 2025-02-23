import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useI18n } from '~/i18n';

type ChatCodeBlockProps = {
  language?: string;
  children: string;
};

export function ChatCodeBlock({ language, children }: ChatCodeBlockProps) {
  const t = useI18n().pack.chat.widgets.code;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#f7f7f8] border border-gray-200 rounded-md">
      <div className="flex justify-between items-center px-4 pt-2">
        <span className="text-gray-600 text-xs">{language || 'plaintext'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? t.copied : t.copy}
        </button>
      </div>

      <SyntaxHighlighter
        language={language || 'plaintext'}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
        }}
        PreTag="div"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
