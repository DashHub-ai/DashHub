import { useI18n } from '~/i18n';

export function NoItemsPlaceholder() {
  const { pack } = useI18n();

  return (
    <div className="flex justify-center items-center text-center uk-text-muted">
      {pack.placeholders.noItemsFound}
    </div>
  );
}
