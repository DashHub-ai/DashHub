import clsx from 'clsx';
import { memo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  content: string;
  inlinedReactComponents?: Record<string, React.ReactNode>;
};

export const MessageMarkdown = memo(({ content, inlinedReactComponents = {} }: Props) => {
  return (
    <Markdown
      className={clsx(
        'prose-table:border-collapse prose-td:border-gray-300 prose-th:border-gray-300 prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border',
        'prose-a:underline prose-code:overflow-auto prose-pre:overflow-auto',
        'prose-ol:list-decimal chat-markdown prose-sm prose-ul:list-disc',
        'prose-hr:my-3',
      )}
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children, ...props }) => {
          if (typeof children === 'string' && children === '$embed') {
            const key = props.href?.replace(/^react\$/, '');

            if (key && inlinedReactComponents[key]) {
              return inlinedReactComponents[key];
            }
          }

          return <a {...props}>{children}</a>;
        },
      }}
    >
      {content}
    </Markdown>
  );
});
