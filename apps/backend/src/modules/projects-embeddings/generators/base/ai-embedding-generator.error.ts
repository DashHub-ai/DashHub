import { TaggedError } from '@dashhub/commons';

export class AIEmbeddingGeneratorError
  extends TaggedError.ofLiteral<any>()('AIEmbeddingGeneratorError') {
}
