import type { Nullable } from '@llm/commons';

type Props = {
  isFilled: Nullable<boolean>;
};

export function HiddenRequiredInput({ isFilled }: Props) {
  if (isFilled) {
    return <div className="h-[1px]" />;
  }

  return (
    <input
      className="opacity-0 h-[1px] border-none block pointer-events-none"
      required
    />
  );
}
