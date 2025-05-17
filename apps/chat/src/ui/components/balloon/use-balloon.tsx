import { type ReactNode, useRef } from 'react';

import { rejectFalsyItems } from '@dashhub/commons';
import { mergeRefs, useModal, useOutsideClickRef, useWindowListener } from '@dashhub/commons-front';

import { BalloonContent } from './balloon-content';

export function useBalloon<E extends HTMLElement>() {
  const targetRef = useRef<E>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const modal = useModal<void, { content: ReactNode; }>({
    renderModalContent: ({ showProps }) => {
      const rect = targetRef.current!.getBoundingClientRect();

      return (
        <BalloonContent contentRef={modalContentRef} targetRect={rect}>
          {showProps.content}
        </BalloonContent>
      );
    },
  });

  const outsideRef = useOutsideClickRef<E>(
    modal.close,
    {
      excludeNodes: () => rejectFalsyItems([modalContentRef.current]),
    },
  );

  useWindowListener(
    {
      resize: modal.close,
      scroll: (e) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
          modal.close();
        }
      },
    },
    {
      options: {
        passive: true,
        capture: true,
      },
    },
  );

  return {
    toggled: modal.toggled,
    targetRef: mergeRefs(targetRef, outsideRef),
    show: (content: ReactNode) => modal.show({ content }),
    hide: modal.close,
  };
}
