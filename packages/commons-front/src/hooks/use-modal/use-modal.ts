import { option as O, task as T, type taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { useContext, useRef, useState } from 'react';

import type { Nullable } from '@llm/commons';

import type { ModalShowConfig } from './modals-context-config.types';

import { useRefSafeCallback } from '../use-ref-safe-callback';
import { ModalsContext } from './modals-context-provider';

export type ShowModalHookResult<Result, ShowProps> = {
  toggled: boolean;
  rerender: (props?: Partial<ShowProps>) => void;
  close: () => void;
  toggle: () => Promise<void>;
  show: (showProps?: ShowProps) => Promise<Nullable<Result>>;
  showAsOptional: (showProps?: ShowProps) => TO.TaskOption<Result>;
};

/**
 * Hook that allows to "imperative" show modal in any callback.
 * Modals mounted by this hook survive component unmount.
 *
 * @example
 *  const useShowMagicModal = () => useModal<number, { magic: number }>({
 *    renderModalContent: ({ showProps: { magic }, on Close ) => (
 *      <Modal magic={magic} onClose={() => onClose(1234)} />
 *    ),
 *  });
 *
 *  ... in component:
 *
 * const modal = useShowMagicModal();
 * const onClick = async () => {
 *    const result = await modal.show({ magic: 1 })
 *    ... and the result is 1234 (see onClose above)
 * };
 */
export function useModal<Result = never, ShowProps = object>(
  config: ModalShowConfig<Result, ShowProps>,
): ShowModalHookResult<Result, ShowProps> {
  const modalsContext = useContext(ModalsContext);
  const modalsContextRef = useRef<typeof modalsContext>();
  modalsContextRef.current = modalsContext;

  const [uuid, setUUID] = useState<string | null>(null);
  const modalHandle = uuid ? modalsContext?.modals[uuid] : null;

  const safeRenderModalContent = useRefSafeCallback(config.renderModalContent);
  const showModal = async (showProps?: ShowProps) =>
    new Promise<Nullable<Result>>((resolve, reject) => {
      if (
        !modalsContextRef.current
        || (typeof uuid === 'string' && modalsContextRef.current.modals[uuid])
      ) {
        reject(new Error('Missing modals context or uuid!'));
        return;
      }

      const { uuid: newUUID } = modalsContextRef.current.showModal({
        ...config,
        showProps,
        renderModalContent: safeRenderModalContent,
        onClose: (result?: Nullable<Result>) => {
          setUUID(null);
          config.onClose?.(result);
          resolve(result);
        },
      });

      setUUID(newUUID);
    });

  const showAsOptional = (showProps?: ShowProps) =>
    pipe(async () => showModal(showProps), T.map(O.fromNullable));

  const closeModal = useRefSafeCallback(() => {
    if (modalHandle && uuid) {
      modalsContextRef.current?.hideModal(uuid);
    }
  });

  const toggleModal = useRefSafeCallback(async () => {
    if (modalHandle) {
      closeModal();
    }
    else {
      await showModal();
    }
  });

  const rerenderModal = useRefSafeCallback((props: Partial<ShowProps> = {}) => {
    if (modalHandle && uuid) {
      modalsContextRef.current?.updateModalProps(uuid, props);
    }
  });

  return {
    toggled: !!modalHandle,
    show: showModal,
    showAsOptional,
    close: closeModal,
    toggle: toggleModal,
    rerender: rerenderModal,
  };
}
