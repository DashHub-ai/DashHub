import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkS3BucketT } from '@llm/sdk';

import { FormField, Input } from '~/components';
import { useI18n } from '~/i18n';

type Value = Pick<SdkS3BucketT, 'name' | 'region' | 'accessKeyId' | 'secretAccessKey'>;

type Props = ValidationErrorsListProps<Value>;

export const S3BucketSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.modules.s3Buckets.form;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.fields.name.label}
        {...validation.extract('name')}
      >
        <Input
          name="name"
          placeholder={t.fields.name.placeholder}
          required
          {...bind.path('name')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.region.label}
        {...validation.extract('name')}
      >
        <Input
          name="region"
          placeholder={t.fields.region.placeholder}
          required
          {...bind.path('region')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.accessKeyId.label}
        {...validation.extract('accessKeyId')}
      >
        <Input
          name="access-key-id"
          placeholder={t.fields.accessKeyId.placeholder}
          required
          {...bind.path('accessKeyId')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.secretAccessKey.label}
        {...validation.extract('secretAccessKey')}
      >
        <Input
          name="access-key-id"
          placeholder={t.fields.secretAccessKey.placeholder}
          required
          {...bind.path('secretAccessKey')}
        />
      </FormField>
    </>
  );
});
