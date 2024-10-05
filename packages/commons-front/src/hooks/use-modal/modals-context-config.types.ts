import type { ReactNode } from 'react';

import type { Nullable } from '@llm/commons';

export type ModalShowRenderAttrs<Result, ShowProps> = {
  showProps: ShowProps;
  onClose: (result?: Nullable<Result>) => void;
};

export type ModalShowConfig<Result = any, ShowProps = any> = {
  showProps?: ShowProps;
  renderModalContent: (
    attrs: ModalShowRenderAttrs<Result, ShowProps>,
  ) => ReactNode;
  onClose?: (result?: Nullable<Result>) => void;
};

export type ModalsContextData = {
  modals: Record<string, ModalShowConfig>;
  hideModal: (uuid: string, result?: unknown) => void;
  updateModalProps: (uuid: string, props: object) => void;
  showModal: (config: ModalShowConfig) => {
    unmount: VoidFunction;
    uuid: string;
  };
};
