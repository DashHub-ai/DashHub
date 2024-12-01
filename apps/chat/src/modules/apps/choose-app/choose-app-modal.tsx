import type { SdkAppT, SdkTableRowWithIdT } from '@llm/sdk';

import { findItemById } from '@llm/commons';
import { Modal, type ModalProps, ModalTitle } from '@llm/ui';
import { useI18n } from '~/i18n';

import { AppsContainer } from '../grid';

export type ChooseAppModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    selectedApps?: SdkTableRowWithIdT[];
    onSelect?: (app: SdkAppT) => void;
  };

export function ChooseAppModal({
  selectedApps,
  onSelect,
  onClose,
  ...props
}: ChooseAppModalProps) {
  const t = useI18n().pack.apps.chooseAppModal;

  const renderAppCTA = (app: SdkAppT) => {
    if (findItemById(app.id)(selectedApps || [])) {
      return (
        <a
          href=""
          className="opacity-50 pointer-events-none uk-button uk-button-secondary uk-button-small uk-disabled"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {t.selected}
        </a>
      );
    }

    return (
      <a
        href=""
        className="uk-button uk-button-secondary uk-button-small"
        onClick={(e) => {
          e.preventDefault();
          onSelect?.(app);
        }}
      >
        {t.select}
      </a>
    );
  };

  return (
    <Modal
      {...props}
      formProps={{
        className: 'w-[1200px]',
      }}
      onClose={onClose}
      header={(
        <ModalTitle>
          {t.title}
        </ModalTitle>
      )}
    >
      <AppsContainer
        itemPropsFn={app => ({
          ctaButton: renderAppCTA(app),
        })}
      />
    </Modal>
  );
}
