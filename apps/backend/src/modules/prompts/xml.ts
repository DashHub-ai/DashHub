import { type FalsyItem, rejectFalsyItems } from '@dashhub/commons';

export type XmlTagOptions = {
  children?: FalsyItem<string>[];
  nestingSpaces?: number;
  attributes?: Record<string, string | number | boolean>;
};

export function xml(
  name: string,
  {
    children = [],
    nestingSpaces = 2,
    attributes = {},
  }: XmlTagOptions = {},
): string {
  const indent = ' '.repeat(nestingSpaces);
  const attributesString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const openTag = attributesString
    ? `<${name} ${attributesString}>`
    : `<${name}>`;

  const childrenContent = (() => {
    if (!children.length) {
      return '';
    }

    return [
      '\n',
      rejectFalsyItems(children)
        .map(child => child.split('\n').map(line => indent + line).join('\n'))
        .join('\n'),
      '\n',
    ].join('');
  })();

  return `${openTag}${childrenContent}</${name}>`;
}
