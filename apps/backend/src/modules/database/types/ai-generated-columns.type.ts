export type AIGeneratedColumns<T extends string> =
  & {
    [key in T]: string | null;
  }
  & {
    [key in `${T}_generated`]: boolean;
  }
  & {
    [key in `${T}_generated_at`]: Date | null;
  };
