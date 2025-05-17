import type { SdkCreateSearchEngineInputT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
} from '~/ui';

import { SearchEngineSharedFormFields } from '../shared';
import { useSearchEngineCreateForm } from './search-engine-create-form';

export type SearchEngineCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkCreateSearchEngineInputT;
    onAfterSubmit?: VoidFunction;
  };

export function SearchEngineCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: SearchEngineCreateFormModalProps,
) {
  const t = useI18n().pack.searchEngines.form;
  const { handleSubmitEvent, validator, submitState, bind } = useSearchEngineCreateForm({
    defaultValue,
    onAfterSubmit,
  });

  return (
    <Modal
      {...props}
      isOverflowVisible
      onClose={onClose}
      formProps={{
        onSubmit: handleSubmitEvent,
      }}
      header={(
        <ModalTitle>
          {t.title.create}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={submitState.loading} onClick={onClose} />
          <CreateButton loading={submitState.loading} type="submit" />
        </>
      )}
    >
      <SearchEngineSharedFormFields
        errors={validator.errors.all as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
