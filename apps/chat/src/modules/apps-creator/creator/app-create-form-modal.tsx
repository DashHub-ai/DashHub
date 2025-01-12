import clsx from 'clsx';
import { useState } from 'react';

import type { SdkCreateAppOutputT } from '@llm/sdk';

import { FormErrorAlert, Modal, type ModalProps, ModalTitle } from '@llm/ui';
import { useI18n } from '~/i18n';

import { AppCreateFormStep1, AppCreateFormStep2 } from './steps';
import { type CreateAppFormValue, useAppCreateForm } from './use-app-create-form';

export type AppCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: CreateAppFormValue;
    onAfterSubmit?: (result: SdkCreateAppOutputT) => void;
  };

export function AppCreateFormModal({
  defaultValue,
  onAfterSubmit,
  onClose,
  ...props
}: AppCreateFormModalProps) {
  const t = useI18n().pack.appsCreator;
  const [currentStep, setCurrentStep] = useState(1);
  const { handleSubmitEvent, validator, submitState, bind, value, setValue } = useAppCreateForm({
    defaultValue,
    onAfterSubmit,
  });

  return (
    <Modal
      {...props}
      isOverflowVisible
      onClose={onClose}
      formProps={currentStep === 2
        ? {
            className: 'w-[500px]',
            onSubmit: handleSubmitEvent,
          }
        : {
            className: 'w-[900px]',
          }}
      footer={null}
      header={(
        <ModalTitle>
          {`${t.create.title} - ${t.create.step} ${currentStep} / 2`}
        </ModalTitle>
      )}
    >
      <div className={clsx({ block: currentStep === 1, hidden: currentStep !== 1 })}>
        <AppCreateFormStep1
          loading={submitState.loading}
          onNext={(summarizedChat) => {
            setValue({
              merge: true,
              value: summarizedChat,
            });

            setCurrentStep(2);
          }}
        />
      </div>

      <div className={clsx({ block: currentStep === 2, hidden: currentStep !== 2 })}>
        <AppCreateFormStep2
          onBack={() => setCurrentStep(1)}
          organization={value.organization}
          loading={submitState.loading}
          errors={validator.errors.all as any}
          {...bind.merged()}
        />
      </div>

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
