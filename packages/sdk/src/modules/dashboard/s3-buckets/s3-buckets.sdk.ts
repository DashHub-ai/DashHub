import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  patchPayload,
  postPayload,
  putPayload,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkTableRowIdT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type {
  SdkCreateS3BucketInputT,
  SdkCreateS3BucketOutputT,
  SdkSearchS3BucketsInputT,
  SdkSearchS3BucketsOutputT,
  SdkUpdateS3BucketInputT,
  SdkUpdateS3BucketOutputT,
} from './dto';

export class S3BucketsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/s3-buckets';

  search = (data: SdkSearchS3BucketsInputT) =>
    this.fetch<SdkSearchS3BucketsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateS3BucketInputT) =>
    this.fetch<SdkCreateS3BucketOutputT, SdkRecordAlreadyExistsError>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });

  unarchive = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/unarchive/${id}`),
      options: patchPayload({}),
    });

  archive = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/archive/${id}`),
      options: patchPayload({}),
    });

  update = ({ id, ...data }: SdkUpdateS3BucketInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateS3BucketOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });
};
