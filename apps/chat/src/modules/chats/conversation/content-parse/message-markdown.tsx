import clsx from 'clsx';
import { memo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  content: string;
};

export const MessageMarkdown = memo(({ content }: Props) => {
  return (
    <Markdown
      className={clsx(
        'prose-table:border-collapse prose-td:border-gray-300 prose-th:border-gray-300 prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border',
        'prose-a:underline prose-code:overflow-auto prose-pre:overflow-auto',
        'prose-ol:list-decimal chat-markdown prose-sm prose-ul:list-disc',
      )}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </Markdown>
  );
});
