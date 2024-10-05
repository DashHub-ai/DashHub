import type { ReactNode } from 'react';

import type { Overwrite } from '@llm/commons';

import type { ModalShowConfig, ModalShowRenderAttrs } from './modals-context-config.types';

import { AnimatedModalWrapper } from './animated-modal-wrapper';
import { useModal } from './use-modal';

export type AnimatedModalShowRenderAttrs<Result, ShowProps> = Omit<
  ModalShowRenderAttrs<Result, ShowProps>,
  'onClose'
> & {
  hiding?: boolean;
  onInstantClose: (result?: Result) => void;
  onAnimatedClose: (result?: Result) => Promise<void>;
};

export type AnimatedModalConfig<Result, ShowProps> = Overwrite<
  ModalShowConfig<Result, ShowProps>,
  {
    closeAnimDuration?: number;
    renderModalContent: (
      attrs: AnimatedModalShowRenderAttrs<Result, ShowProps>,
    ) => ReactNode;
  }
>;

/**
 * Modal that shows modal and after calling onAnimatedClose removes
 * it from tree after specified delay in `closedAnimDuration`.
 * It is useful in components with hide animations.
 *
 * @example
 *  const modal = useAnimatedModal<boolean>({
 *    closeAnimDuration: 500,
 *    renderModalContent: ({ hiding, onAnimatedClose }) => (
 *      <UpdateResidentialAddressModal
 *        visible={!hiding}
 *        onDismiss={() => onAnimatedClose(false)}
 *      />
 *    ),
 *  });
 *  ...
 *  modal.show().then(...)
 *
 *  After calling onDismiss component will set state hiding to true
 *  and after 500ms it will be switched to false and modal will be
 *  removed from DOM.
 */
export function useAnimatedModal<Result = never, ShowProps = never>({
  closeAnimDuration = 300,
  renderModalContent,
  ...config
}: AnimatedModalConfig<Result, ShowProps>) {
  return useModal<Result, ShowProps>({
    ...config,
    renderModalContent: ({ onClose, ...attrs }) => (
      <AnimatedModalWrapper
        closeAnimDuration={closeAnimDuration}
        onClose={onClose}
      >
        {({ hiding, performCloseAnim }) =>
          renderModalContent({
            ...attrs,
            hiding,
            onInstantClose: onClose,
            onAnimatedClose: performCloseAnim,
          })}
      </AnimatedModalWrapper>
    ),
  });
}
