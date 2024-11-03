import { useForwardedI18n } from '~/i18n';

export function NoItemsPlaceholder() {
  const { pack } = useForwardedI18n();

  return (
    <div className="flex justify-center items-center text-center uk-text-muted">
      {pack.placeholders.noItemsFound}
    </div>
  );
}
