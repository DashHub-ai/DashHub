import type { SdkUserT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { UserAISettingsFormField, useUserUpdateForm } from '~/modules/users/form';
import { UserUpdateAuthMethodsFormField } from '~/modules/users/form/update/fields';
import { FormErrorAlert, FormField, Input, SaveButton, SelectGenericFileInput } from '~/ui';

type Props = {
  defaultValue: SdkUserT;
};

export function UpdateMeForm({ defaultValue }: Props) {
  const t = useI18n().pack.users.form;
  const { handleSubmitEvent, validator, bind, submitState, value } = useUserUpdateForm({
    defaultValue,
  });

  return (
    <form onSubmit={handleSubmitEvent}>
      <FormField
        className="uk-margin"
        label={t.fields.name.label}
        {...validator.errors.extract('name')}
      >
        <Input
          name="name"
          autoComplete="new-name"
          placeholder={t.fields.name.placeholder}
          required
          {...bind.path('name')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.email.label}
        {...validator.errors.extract('email')}
      >
        <Input
          name="email"
          autoComplete="new-email"
          placeholder={t.fields.email.placeholder}
          required
          {...bind.path('email')}
        />
      </FormField>

      <UserAISettingsFormField
        {...validator.errors.extract('aiSettings', { nested: true })}
        {...bind.path('aiSettings')}
      />

      {value.role !== 'root' && (
        <FormField
          className="uk-margin"
          label={t.fields.avatar.label}
        >
          <SelectGenericFileInput
            name="avatar"
            accept="image/*"
            {...bind.path('avatar')}
          />
        </FormField>
      )}

      <UserUpdateAuthMethodsFormField
        {...validator.errors.extract('auth', { nested: true })}
        {...bind.path('auth')}
      />

      <FormErrorAlert result={submitState.result} />

      <div className="flex flex-row justify-end">
        <SaveButton
          type="submit"
          loading={submitState.loading}
        />
      </div>
    </form>
  );
}
