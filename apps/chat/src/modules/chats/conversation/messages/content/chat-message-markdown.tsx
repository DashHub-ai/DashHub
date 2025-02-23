import clsx from 'clsx';
import { Children, memo } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { ChatCodeBlock } from './widgets';

type Props = {
  content: string;
  inlinedReactComponents?: Record<string, React.ReactNode>;
  isStreaming?: boolean;
};

export const ChatMessageMarkdown = memo(({ content, inlinedReactComponents = {}, isStreaming }: Props) => {
  return (
    <Markdown
      className={clsx(
        'prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-gray-300 prose-th:border-gray-300 prose-table:border-collapse',
        'prose-a:underline prose-code:overflow-auto',
        'prose-ol:list-decimal chat-markdown prose-sm prose-ul:list-disc',
        'prose-hr:my-3',
        '[&_.footnotes]:text-xs [&_.footnotes]:text-gray-600',
        '[&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:!bg-transparent',
      )}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        blockquote: ({ children }) => (
          <blockquote className="my-2 pl-4 border-gray-300 border-l-4 italic">{children}</blockquote>
        ),
        a: ({ children, ...props }) => {
          if (typeof children === 'string' && children === '$embed') {
            const key = props.href?.replace(/^react\$/, '');

            if (key && inlinedReactComponents[key]) {
              return inlinedReactComponents[key];
            }
          }

          return <a {...props}>{children}</a>;
        },
        pre: ({ children }) => {
          const hasCodeTag = (
            Children
              // eslint-disable-next-line react/no-children-to-array
              .toArray(children)
              .some((child: any) => child.props?.className?.startsWith('language-'))
          );

          if (hasCodeTag) {
            return <>{children}</>;
          }

          return <pre className="bg-gray-100 p-2 rounded-md">{children}</pre>;
        },
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match
            ? (
                <ChatCodeBlock language={match[1]} initialShowPreview={!isStreaming}>
                  {String(children).replace(/\n$/, '')}
                </ChatCodeBlock>
              )
            : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
        },
      }}
    >
      {content}
    </Markdown>
  );
});
