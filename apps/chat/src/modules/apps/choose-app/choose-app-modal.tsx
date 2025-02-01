import { suppressEvent } from '@under-control/forms';

import type { SdkAppT, SdkTableRowWithIdT } from '@llm/sdk';

import { findItemById } from '@llm/commons';
import { useI18n } from '~/i18n';
import { Modal, type ModalProps, ModalTitle, SelectRecordButton } from '~/ui';

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
    const installed = !!findItemById(app.id)(selectedApps || []);

    return (
      <SelectRecordButton
        className="uk-button-small"
        disabled={installed}
        selected={installed}
        onClick={(e) => {
          suppressEvent(e);
          onSelect?.(app);
        }}
      />
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
        columns={2}
        itemPropsFn={app => ({
          ctaButton: renderAppCTA(app),
        })}
      />
    </Modal>
  );
}
