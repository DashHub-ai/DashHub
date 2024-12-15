import type { Buffer } from 'node:buffer';

import path, { basename } from 'node:path';

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
      s3Dir = '/',
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
      TE.chainW(({ client, bucket }) => S3UploadError.tryCatch(
        () => client.putObject(bucket.bucketName, s3Key, buffer),
      )),
      TE.chainW(() => this.s3ResourcesRepo.create({
        value: {
          bucketId,
          s3Key,
          name: name ?? basename(s3Key),
          type: 'other',
        },
      })),
    );
  };
}

type UploadTE = TE.TaskEither<
  DatabaseError
  | DatabaseRecordAlreadyExists
  | DatabaseRecordNotExists
  | S3UploadError
  | SdkInvalidFileFormatError,
  TableRowWithId
>;

export type UploadFileAttrs = {
  bucketId: TableId;
  buffer: Buffer | string;
  mimeType: string;
  name?: string;
  s3Dir?: string;
};
