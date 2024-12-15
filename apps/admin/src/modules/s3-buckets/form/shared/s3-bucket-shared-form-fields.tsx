import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkS3BucketT } from '@llm/sdk';

import { Checkbox, FormField, Input, NumericInput } from '@llm/ui';
import { useI18n } from '~/i18n';

type Value = Pick<
  SdkS3BucketT,
  'name' | 'region' | 'accessKeyId' | 'secretAccessKey' |
  'default' | 'ssl' | 'endpoint' | 'port' | 'bucketName' | 'publicBaseUrl'
>;

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

      <FormField
        className="uk-margin"
        label={t.fields.port.label}
        {...validation.extract('port')}
      >
        <NumericInput
          name="access-key-id"
          placeholder={t.fields.port.placeholder}
          required
          {...bind.path('port')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.endpoint.label}
        {...validation.extract('endpoint')}
      >
        <Input
          name="endpoint"
          placeholder={t.fields.endpoint.placeholder}
          required
          {...bind.path('endpoint')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.publicBaseUrl.label}
        {...validation.extract('publicBaseUrl')}
      >
        <Input
          name="publicBaseUrl"
          placeholder={t.fields.publicBaseUrl.placeholder}
          required
          {...bind.path('publicBaseUrl')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.bucketName.label}
        {...validation.extract('bucketName')}
      >
        <Input
          name="bucketName"
          placeholder={t.fields.bucketName.placeholder}
          required
          {...bind.path('bucketName')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.settings.label}
      >
        <Checkbox
          {...bind.path('default')}
          className="block uk-text-small"
        >
          {t.fields.defaultForOrganization.label}
        </Checkbox>

        <Checkbox
          {...bind.path('ssl')}
          className="block uk-text-small"
        >
          {t.fields.ssl.label}
        </Checkbox>
      </FormField>
    </>
  );
});
