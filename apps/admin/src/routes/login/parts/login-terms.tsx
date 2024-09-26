import { reactFormat } from '@llm/commons-front';
import { useI18n } from '~/i18n';

export function LoginTerms() {
  const t = useI18n().pack.routes.login;

  return (
    <p className="px-8 text-center text-sm text-muted-foreground">
      {reactFormat(t.terms.phrase, {
        terms: (
          <a className="underline underline-offset-4 hover:text-primary" href="#demo" uk-toggle="" role="button">
            {t.terms.terms}
          </a>
        ),
        privacy: (
          <a className="underline underline-offset-4 hover:text-primary" href="#demo" uk-toggle="" role="button">
            {t.terms.privacy}
          </a>
        ),
      })}
    </p>
  );
}
