import { useI18n } from '~/i18n';

export function ContinueWithDivider() {
  const t = useI18n().pack.routes.login;

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border"></span>
      </div>

      <div className="relative flex justify-center text-xs uppercase">
        <div className="bg-background px-2 text-muted-foreground">
          {t.orContinueWith}
        </div>
      </div>
    </div>
  );
}
