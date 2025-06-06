import { suppressEvent } from '@under-control/forms';

import type { SdkAppT, SdkTableRowWithIdT } from '@dashhub/sdk';

import { findItemById } from '@dashhub/commons';
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
        className: 'w-[1500px] max-w-[90vw]',
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
