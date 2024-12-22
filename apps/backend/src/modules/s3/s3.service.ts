import type { Buffer } from 'node:buffer';

import path from 'node:path';

import { either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import * as Minio from 'minio';
import { inject, injectable } from 'tsyringe';
import { v4 } from 'uuid';

import { SdkInvalidFileFormatError } from '@llm/sdk';
import { tryDecodeMimeTypeExtension } from '~/helpers';

import type { DatabaseError, DatabaseRecordAlreadyExists, DatabaseRecordNotExists, TableId, TableRowWithId } from '../database';

import { S3ResourcesBucketsRepo, S3ResourcesRepo } from './repo';
import { S3UploadError } from './s3.errors';

@injectable()
export class S3Service {
  constructor(
    @inject(S3ResourcesBucketsRepo) private readonly s3ResourcesBucketsRepo: S3ResourcesBucketsRepo,
    @inject(S3ResourcesRepo) private readonly s3ResourcesRepo: S3ResourcesRepo,
  ) {}

  getBucketS3Access = (bucketId: TableId) => pipe(
    this.s3ResourcesBucketsRepo.findById({
      id: bucketId,
    }),
    TE.map(bucket => ({
      bucket,
      client: new Minio.Client({
        endPoint: bucket.endpoint,
        port: bucket.port,
        useSSL: bucket.ssl,
        accessKey: bucket.accessKeyId,
        secretKey: bucket.secretAccessKey,
      }),
    })),
  );

  uploadFile = (
    {
      bucketId,
      buffer,
      name,
      mimeType,
      s3Dir = '',
    }: UploadFileAttrs,
  ): UploadTE => {
    const mimeTypeResult = tryDecodeMimeTypeExtension(mimeType);

    if (E.isLeft(mimeTypeResult)) {
      return TE.left(
        new SdkInvalidFileFormatError({ mimeType }),
      );
    }

    const s3Key = path.join(s3Dir, `${v4()}.${mimeTypeResult.right}`);

    return pipe(
      this.getBucketS3Access(bucketId),
      TE.chainW(({ client, bucket }) => pipe(
        S3UploadError.tryCatch(
          () => client.putObject(bucket.bucketName, s3Key, buffer),
        ),
        TE.chainW(() => this.s3ResourcesRepo.create({
          value: {
            bucketId,
            s3Key,
            name,
            type: 'other',
          },
        })),
        TE.map(({ id }) => ({
          id,
          publicUrl: `${bucket.publicBaseUrl}/${s3Key}`,
        })),
      )),
    );
  };

  deleteFile = (
    {
      resourceId,
    }: {
      resourceId: TableId;
    },
  ) => pipe(
    TE.Do,
    TE.bind('resource', () => this.s3ResourcesRepo.findById({ id: resourceId })),
    TE.bind('bucketAccess', ({ resource: { bucketId } }) => this.getBucketS3Access(bucketId)),
    TE.chainW(({ resource, bucketAccess: { client, bucket } }) => S3UploadError.tryCatch(
      () => client.removeObject(bucket.bucketName, resource.s3Key),
    )),
    TE.chainW(() => this.s3ResourcesRepo.delete({
      id: resourceId,
    })),
  );
}

type UploadTE = TE.TaskEither<
  DatabaseError
  | DatabaseRecordAlreadyExists
  | DatabaseRecordNotExists
  | S3UploadError
  | SdkInvalidFileFormatError,
  TableRowWithId & {
    publicUrl: string;
  }
>;

export type UploadFilePayload = Buffer | string;

export type UploadFileAttrs = {
  bucketId: TableId;
  buffer: UploadFilePayload;
  mimeType: string;
  name: string;
  s3Dir?: string;
};
