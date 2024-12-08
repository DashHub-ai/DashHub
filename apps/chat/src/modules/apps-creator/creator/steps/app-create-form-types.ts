import type { SdkCreateAppInputT } from '@llm/sdk';

export type StepProps = {
  onNext?: () => void;
  onBack?: () => void;
  loading?: boolean;
  value: SdkCreateAppInputT;
};
