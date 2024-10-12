export type ParameterizedPathAttrs = Record<string, string | number | boolean>;

export function parameterizePath(parameters: ParameterizedPathAttrs) {
  return (path: string) =>
    Object.entries(parameters).reduce(
      (acc, [parameter, value]) =>
        acc.replace(`:${parameter}`, value.toString()),
      path,
    );
}
