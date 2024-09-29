const INNER_ITEM_MATCH_REGEX: RegExp = /%\{([?.\w]*)\}/g;

/**
 * Inserts into template string with {{ }} characters variables
 *
 * @example
 * "test {{ }}" => "test variableValue"
 * "test {{ abc }}" => "test abc"
 */
export function format(str: string, params: any): string {
  let counter = 0;

  return str.replace(INNER_ITEM_MATCH_REGEX, (_, match) => {
    if (typeof match === 'string' && match.length) {
      return params[match.trim()];
    }

    return params[counter++];
  });
}
