import {
  either as E,
  type readerEither as RE,
  type readerTaskEither as RTE,
  type task as T,
  taskEither as TE,
} from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

/**
 * Abstract class representing a tagged error.
 *
 * @template T - The type of the tag.
 */
export abstract class TaggedError<
  TA extends string,
  C extends object = object,
> extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  readonly httpCode: number = 500;

  /**
   * The tag associated with the error.
   */
  abstract readonly tag: TA;

  /**
   * Constructs a new TaggedError instance.
   */
  constructor(readonly context: C) {
    super();

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, TaggedError);
    }
  }

  /**
   * Serializes the error to a plain object.
   */
  serialize(): SerializedTaggedError {
    return {
      tag: this.tag,
      context: this.context,
    };
  }

  /**
   * Deserializes a serialized TaggedError.
   */
  static deserialize({ tag, context }: SerializedTaggedError) {
    class DeserializedTaggedError extends TaggedError<string, any> {
      readonly tag = tag;
    };

    return new DeserializedTaggedError(context);
  }

  /**
   * Creates a new TaggedLiteralError class with the specified tag.
   *
   * @returns A new TaggedLiteralError class.
   */
  static ofLiteral<C extends object>() {
    return <const S extends string>(tag: S) =>
      class TaggedLiteralError extends TaggedError<S, C> {
        readonly tag = tag;
      };
  }

  /**
   * Creates a new TaggedLiteralError instance with the specified tag.
   *
   * @warning This method is unsafe because it initialized context of tagged error with exception.
   */
  static tryUnsafeTask = <TA extends string, A>(
    TaggedError: { new(context: any): TaggedError<TA, any>; },
    task: T.Task<A>,
  ): TE.TaskEither<TaggedError<TA>, A> =>
    TE.tryCatch(
      task,
      (error) => {
        if (error instanceof TaggedError) {
          return error;
        }

        return new TaggedError(error);
      },
    );
}

/**
 * A serialized TaggedError.
 */
export type SerializedTaggedError = {
  tag: string;
  context: any;
};

/**
 * Checks if the provided error is a TaggedError.
 *
 * @param error - The error to check.
 * @returns True if the error is a TaggedError, false otherwise.
 */
export function isTaggedError(error: any): error is TaggedError<any> {
  return error && 'tag' in error;
}

/**
 * Catch a tagged error and apply a catch function to it.
 *
 * @param tag - The tag to catch.
 * @returns A function that takes a catch function and a task to catch the error from.
 */
export function catchEitherTagError<const T extends string>(tag: T) {
  return <E, E2, B>(catchTask: RE.ReaderEither<Extract<E, TaggedError<T>>, E2, B>) =>
    <A>(
      task: E.Either<Extract<E, TaggedError<T>> extends never ? never : E, A>,
    ) =>
      pipe(
        task,
        E.foldW((error): E.Either<E | E2, A | B> => {
          if (isTaggedError(error) && error.tag === tag) {
            return catchTask(error as any);
          }

          return E.left(error);
        }, E.of),
      ) as E.Either<Exclude<E, TaggedError<T>> | E2, A | B>;
}

/**
 * Catch a tagged error and apply a catch function to it.
 *
 * @param tag - The tag to catch.
 * @returns A function that takes a catch function and a task to catch the error from.
 */
export function catchTaskEitherTagError<const T extends string>(tag: T) {
  return <E, E2, B>(catchTask: RTE.ReaderTaskEither<Extract<E, TaggedError<T>>, E2, B>) =>
    <A>(
      task: TE.TaskEither<Extract<E, TaggedError<T>> extends never ? never : E, A>,
    ) =>
      pipe(
        task,
        TE.foldW((error): TE.TaskEither<E | E2, A | B> => {
          if (isTaggedError(error) && error.tag === tag) {
            return catchTask(error as any);
          }

          return TE.left(error);
        }, TE.of),
      ) as TE.TaskEither<Exclude<E, TaggedError<T>> | E2, A | B>;
}
