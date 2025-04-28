import { xml } from '../../xml';

export function createDateTimeContextPrompt(): string {
  const today = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const date = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return xml('date-time-context', {
    children: [
      xml('current-date', { children: [date] }),
      xml('day-of-week', { children: [dayOfWeek] }),
      xml('time-zone', { children: [timeZone] }),
      xml('current-time', { children: [new Date().toLocaleTimeString()] }),
      xml('instructions', {
        children: [
          'Use this information when the user asks about the current date or day of the week.',
          'Do not mention this information unless specifically relevant to the conversation.',
          'Use this for tasks that require date or time context.',
        ],
      }),
    ],
  });
}
