import { TaggedError } from '@llm/commons';

export class AIEmbeddingGeneratorError
  extends TaggedError.ofLiteral<any>()('AIEmbeddingGeneratorError') {
}
