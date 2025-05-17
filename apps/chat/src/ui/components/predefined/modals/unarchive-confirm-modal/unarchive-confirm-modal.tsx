import { useControlStrict } from '@under-control/forms';

import { type CanBePromise, format } from '@dashhub/commons';
import { useAsyncCallback } from '@dashhub/commons-front';
import { useI18n } from '~/i18n';
import { Checkbox } from '~/ui/components/controls';
import { Modal, type ModalProps, ModalTitle } from '~/ui/components/modal';

import { CancelButton, UnarchiveButton } from '../../buttons';

export type UnarchiveConfirmModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'footer'>
  & {
    unarchiveItemsCount?: number;
    onConfirm: () => CanBePromise<any>;
  };

export function UnarchiveConfirmModal(
  {
    unarchiveItemsCount = 1,
    onConfirm,
    onClose,
    ...props
  }: UnarchiveConfirmModalProps,
) {
  const t = useI18n().pack.modals.unarchiveConfirm;
  const confirm = useControlStrict<boolean>({
    defaultValue: false,
  });

  const [onPromiseConfirm, { isLoading }] = useAsyncCallback(async () =>
    onConfirm(),
  );

  return (
    <Modal
      {...props}
      onClose={onClose}
      header={(
        <ModalTitle>
          {t.title}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={isLoading} onClick={onClose} />
          <UnarchiveButton
            type="submit"
            disabled={!confirm.value}
            loading={isLoading}
          />
        </>
      )}
      formProps={{
        onSubmit: (e) => {
          e.preventDefault();
          void onPromiseConfirm();
        },
      }}
    >
      <p className="block">
        {(
          unarchiveItemsCount && unarchiveItemsCount > 1
            ? format(t.message.multiple, { count: unarchiveItemsCount })
            : t.message.single
        )}
      </p>

      <Checkbox {...confirm.bind.entire()} className="block mt-4">
        {t.yesIAmSure}
      </Checkbox>
    </Modal>
  );
}
