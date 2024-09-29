import type { DateOrString } from '../../types';

export type FormatDateAttrs = {
  witDate?: boolean;
  withTime?: boolean;
  divider?: string;
};

export function formatDate(date: DateOrString, { divider, witDate = true, withTime = true }: FormatDateAttrs = {}) {
  const currentDate = new Date(date);
  const parsedDate = currentDate.toLocaleString('de', {
    hour12: false,
    ...(witDate && {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    ...(withTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  });

  if (divider) {
    return parsedDate.replaceAll('.', divider);
  }

  return parsedDate;
}
