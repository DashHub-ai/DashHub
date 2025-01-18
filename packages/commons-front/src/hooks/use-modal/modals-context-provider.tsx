import {
  cloneElement,
  createContext,
  type ReactElement,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { ModalsContextData, ModalShowConfig } from './modals-context-config.types';

import { useRefSafeCallback } from '../use-ref-safe-callback';

export const ModalsContext = createContext<ModalsContextData | null>(null);

type RenderChildrenAttrs = {
  modalVisible?: boolean;
};

type ModalsContextProviderProps = {
  children: ReactNode | ((attrs: RenderChildrenAttrs) => ReactNode);
};

export function ModalsContextProvider({
  children,
}: ModalsContextProviderProps) {
  const [modals, setModals] = useState<ModalsContextData['modals']>({});
  const counterRef = useRef<number>(0);

  const modalVisible = Object.keys(modals).length > 0;

  const hideModal = useRefSafeCallback((uuid: string, result?: any) => {
    modals[uuid]?.onClose?.(result);
    setModals(({ [uuid]: _, ...otherModals }) => otherModals);
  });

  const showModal: ModalsContextData['showModal'] = useRefSafeCallback(
    (modal: ModalShowConfig) => {
      const nextCounter = counterRef.current + 1;
      counterRef.current = nextCounter;

      const uuid = `modal-${nextCounter}-${Date.now()}`;
      setModals(prevModals => ({
        ...prevModals,
        [uuid]: modal,
      }));

      return {
        uuid,
        unmount: () => {
          hideModal(uuid);
        },
      };
    },
  );

  const updateModalProps: ModalsContextData['updateModalProps']
    = useRefSafeCallback((uuid: string, props: object) => {
      setModals((prevModals) => {
        const prevModal = prevModals[uuid];
        if (!prevModal) {
          return prevModals;
        }

        return {
          ...prevModals,
          [uuid]: {
            ...prevModal,
            showProps: {
              ...(prevModal?.showProps as object),
              ...props,
            },
          },
        };
      });
    });

  const value = useMemo(() => ({
    modals,
    showModal,
    hideModal,
    updateModalProps,
  }), [modals]);

  return (
    <ModalsContext value={value}>
      {typeof children === 'function' ? children({ modalVisible }) : children}
      {modalVisible && (
        <div id="modals-root">
          {Object.entries(modals).map(([uuid, modalConfig]) =>
            // eslint-disable-next-line react/no-clone-element
            cloneElement(
              modalConfig.renderModalContent({
                showProps: modalConfig.showProps,
                onClose: (result?: unknown) => {
                  hideModal(uuid, result);
                },
              }) as ReactElement,
              {
                key: uuid,
              },
            ),
          )}
        </div>
      )}
    </ModalsContext>
  );
}
