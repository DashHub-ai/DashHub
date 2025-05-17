import { reactFormat } from '@dashhub/commons-front';
import { useI18n } from '~/i18n';

export function LoginTerms() {
  const t = useI18n().pack.routes.login;

  return (
    <p className="px-8 text-muted-foreground text-sm text-center">
      {reactFormat(t.terms.phrase, {
        terms: (
          <a className="hover:text-primary underline underline-offset-4" href="#" uk-toggle="" role="button">
            {t.terms.terms}
          </a>
        ),
        privacy: (
          <a className="hover:text-primary underline underline-offset-4" href="#" uk-toggle="" role="button">
            {t.terms.privacy}
          </a>
        ),
      })}
    </p>
  );
}
