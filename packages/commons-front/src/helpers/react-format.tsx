import { Fragment, type ReactNode } from 'react';

export function reactFormat(str: string, templateArgs: Record<string, ReactNode>): ReactNode {
  const tokens = str.split(/(%\{[?.\w]*\})/g);

  return tokens.map((token) => {
    const match = token.match(/%\{([?.\w]*)\}/);
    if (!match?.length) {
      return token;
    }

    const [, key] = match;
    return <Fragment key={key}>{templateArgs[key]}</Fragment>;
  });
}
