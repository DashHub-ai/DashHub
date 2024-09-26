/* eslint-disable ts/consistent-type-definitions, ts/no-namespace */
type Props = {
  className?: string;
  icon: string;
};

export function UkIcon({ className, icon }: Props) {
  return (
    <uk-icon
      class={className}
      icon={icon}
    />
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'uk-icon': {
        icon: string;
        class?: string;
      };
    }
  }
}
