import type { SdkSearchEngineT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import {
  CancelButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '~/ui';

import { SearchEngineSharedFormFields } from '../shared';
import { useSearchEngineUpdateForm } from './use-search-engine-update-form';

export type SearchEngineUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    app: SdkSearchEngineT;
    onAfterSubmit?: VoidFunction;
  };

export function SearchEngineUpdateFormModal(
  {
    app,
    onAfterSubmit,
    onClose,
    ...props
  }: SearchEngineUpdateFormModalProps,
) {
  const t = useI18n().pack.searchEngines.form;
  const { handleSubmitEvent, validator, submitState, bind } = useSearchEngineUpdateForm({
    defaultValue: app,
    onAfterSubmit,
  });

  return (
    <Modal
      {...props}
      onClose={onClose}
      formProps={{
        onSubmit: handleSubmitEvent,
      }}
      header={(
        <ModalTitle>
          {t.title.edit}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={submitState.loading} onClick={onClose} />
          <UpdateButton loading={submitState.loading} type="submit" />
        </>
      )}
    >
      <SearchEngineSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
