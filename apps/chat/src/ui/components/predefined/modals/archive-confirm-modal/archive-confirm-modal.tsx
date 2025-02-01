import { useControlStrict } from '@under-control/forms';

import { type CanBePromise, format } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { useI18n } from '~/i18n';
import { Checkbox } from '~/ui/components/controls';
import { Modal, type ModalProps, ModalTitle } from '~/ui/components/modal';

import { ArchiveButton, CancelButton } from '../../buttons';

export type ArchiveConfirmModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'footer'>
  & {
    archiveItemsCount?: number;
    onConfirm: () => CanBePromise<any>;
  };

export function ArchiveConfirmModal(
  {
    archiveItemsCount = 1,
    onConfirm,
    onClose,
    ...props
  }: ArchiveConfirmModalProps,
) {
  const t = useI18n().pack.modals.archiveConfirm;
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
          <ArchiveButton
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
          archiveItemsCount && archiveItemsCount > 1
            ? format(t.message.multiple, { count: archiveItemsCount })
            : t.message.single
        )}
      </p>

      <Checkbox {...confirm.bind.entire()} className="block mt-4">
        {t.yesIAmSure}
      </Checkbox>
    </Modal>
  );
}
