import { clsx } from 'clsx';

import type { SdkSearchPinnedMessageItemT } from '@llm/sdk';

import { formatDate } from '@llm/commons';

import { PinnedMessageCard } from './pinned-message-card';

type TimelineProps = {
  items: SdkSearchPinnedMessageItemT[];
};

export function PinnedMessagesTimeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      <div className="top-0 bottom-0 left-1/2 absolute bg-gray-200 w-0.5 -translate-x-1/2" />

      <div className="relative space-y-12">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={item.id} className="relative">
              <div className="top-7 left-1/2 absolute bg-white border-2 border-gray-300 rounded-full w-3 h-3 -translate-x-1/2" />

              <div className={clsx('flex items-start', isEven ? 'justify-end pr-[52%]' : 'justify-start pl-[52%]')}>
                <div
                  className="top-1/2 left-1/2 absolute bg-gray-200 w-4 h-0.5"
                  style={{
                    transform: `translateX(${isEven ? '-100%' : '0'})`,
                  }}
                />

                <div className="w-full max-w-xl">
                  <div className="clear-both">
                    <PinnedMessageCard pinnedMessage={item} />
                  </div>

                  <div
                    className={clsx(
                      'inline-block bg-gray-50 px-3 pt-4 rounded-full text-gray-600 text-sm',
                      isEven ? 'float-right' : 'float-left',
                    )}
                  >
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
