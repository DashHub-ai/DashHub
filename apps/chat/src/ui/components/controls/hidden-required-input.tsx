import type { Nullable } from '@dashhub/commons';

type Props = {
  isFilled: Nullable<boolean>;
};

export function HiddenRequiredInput({ isFilled }: Props) {
  if (isFilled) {
    return <div className="h-[1px]" />;
  }

  return (
    <input
      className="block opacity-0 border-none h-[1px] pointer-events-none"
      required
    />
  );
}
