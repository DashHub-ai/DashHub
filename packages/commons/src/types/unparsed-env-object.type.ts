export type UnparsedEnvObject<O> = O extends null
  ? null
  : O extends object
    ? {
        [K in keyof O]: UnparsedEnvObject<O[K]>;
      }
    : string | undefined;
