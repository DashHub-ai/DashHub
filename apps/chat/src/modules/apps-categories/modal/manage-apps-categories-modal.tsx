import type { SdkAppT, SdkTableRowWithIdT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { Modal, type ModalProps, ModalTitle } from '~/ui';

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
