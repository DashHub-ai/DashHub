import { isEmpty } from 'fp-ts/lib/Record';
import { singleton } from 'tsyringe';
import { createLogger, format, transports } from 'winston';

@singleton()
export class LoggerService {
  /**
   * Create a new logger instance with the given prefix.
   */
  public static of(prefix: string) {
    const { colorize, timestamp, splat, align, printf } = format;

    return createLogger({
      format: format.combine(
        colorize({
          all: true,
        }),
        timestamp(),
        splat(),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const serializedMeta = (
            isEmpty(meta)
              ? ''
              : JSON.stringify(meta, null, 2)
          );

          return `[${timestamp}][${prefix}] ${level}: ${(message as string).trim()} ${serializedMeta}`.trim();
        }),
      ),
      transports: [new transports.Console()],
    });
  }
}
