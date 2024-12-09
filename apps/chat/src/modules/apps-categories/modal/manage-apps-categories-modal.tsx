import type { SdkAppT, SdkTableRowWithIdT } from '@llm/sdk';

import { Modal, type ModalProps, ModalTitle } from '@llm/ui';
import { useI18n } from '~/i18n';

import { AppsCategoriesTableContainer } from '../table';

type Props =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    selectedApps?: SdkTableRowWithIdT[];
    onSelect?: (app: SdkAppT) => void;
  };

export function ManageAppsCategoriesModal(
  {
    selectedApps,
    onSelect,
    onClose,
    ...props
  }: Props,
) {
  const t = useI18n().pack.appsCategories.manageAppsCategories;

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
      <AppsCategoriesTableContainer />
    </Modal>
  );
}
