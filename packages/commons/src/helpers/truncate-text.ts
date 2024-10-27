export function truncateText(length: number, literal: string = '...') {
  return (input: string) =>
    input.length > length ? `${input.substring(0, length)}${literal}` : input;
}
