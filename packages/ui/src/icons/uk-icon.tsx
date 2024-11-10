/* eslint-disable ts/consistent-type-definitions, ts/no-namespace */
type Props = {
  className?: string;
  icon: string;
  size?: number;
};

export function UkIcon({ className, icon, size = 16 }: Props) {
  return (
    <uk-icon
      class={className}
      icon={icon}
      width={size}
      height={size}
    />
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'uk-icon': {
        icon: string;
        class?: string;
        width?: number;
        height?: number;
      };
    }
  }
}
