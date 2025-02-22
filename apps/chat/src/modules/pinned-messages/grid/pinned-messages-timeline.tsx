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

      <div className="relative">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={item.id} className="relative" style={{ marginTop: index === 0 ? '2rem' : '-4rem' }}>
              <div className="top-[29px] left-1/2 z-10 absolute bg-white border-2 border-gray-300 rounded-full w-3 h-3 -translate-x-1/2" />

              <div className="top-[29px] left-1/2 absolute -translate-x-1/2 -translate-y-12">
                <span className="bg-gray-50 px-3 py-1 rounded-full text-gray-600 text-xs">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              <div className={clsx('flex items-start', isEven ? 'justify-end pr-[56%]' : 'justify-start pl-[56%]')}>
                <div
                  className="top-[34px] left-1/2 absolute bg-gray-200 w-4 h-0.5"
                  style={{
                    transform: `translateX(${isEven ? '-100%' : '0'})`,
                  }}
                />

                <div className="w-full max-w-xl">
                  <PinnedMessageCard pinnedMessage={item} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
