import type { LogEvent } from 'kysely';

export function isSilentDbLog(event: LogEvent) {
  return event.level !== 'query';
}
