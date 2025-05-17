import type { TaskEither } from 'fp-ts/lib/TaskEither';

import type { TaggedError } from '@dashhub/commons';
import type { SdkSearchAIModelItemT } from '@dashhub/sdk';
import type { UploadFilePayload } from '~/modules/s3';

import type { ProjectEmbeddingsInsertTableRow } from '../../projects-embeddings.tables';

export type AIEmbeddingGenerateAttrs = {
  fileName: string;
  fileUrl: string;
  buffer: UploadFilePayload;
  aiModel: SdkSearchAIModelItemT;
  chunked?: boolean;
};

export type AIEmbeddingResult =
  & Pick<ProjectEmbeddingsInsertTableRow, 'metadata' | 'text' | 'summary'>
  & {
    vector: number[];
  };

export type AIEmbeddingGenerateTE = TaskEither<TaggedError<string>, Array<AIEmbeddingResult>>;

export type AIEmbeddingGenerator = {
  generate: (attrs: AIEmbeddingGenerateAttrs) => AIEmbeddingGenerateTE;
};
