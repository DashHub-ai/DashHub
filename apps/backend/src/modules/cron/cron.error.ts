import { TaggedError } from '@dashhub/commons';

/**
 * Error that occurs when a cron job fails.
 */
export class CronError extends TaggedError.ofLiteral()('CronError') {}
