import type { TaskEither } from 'fp-ts/lib/TaskEither';

import type { TaggedError } from '@llm/commons';
import type { SdkSearchAIModelItemT } from '@llm/sdk';
import type { UploadFilePayload } from '~/modules/s3';

import type { ProjectEmbeddingsInsertTableRow } from '../../projects-embeddings.tables';

export type AIEmbeddingGenerateAttrs = {
  buffer: UploadFilePayload;
  aiModel: SdkSearchAIModelItemT;
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
