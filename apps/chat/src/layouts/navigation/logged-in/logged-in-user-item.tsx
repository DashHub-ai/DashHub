import { LogOut, Settings } from 'lucide-react';
import { Link } from 'wouter';

import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { LoggedInButton } from './logged-in-button';

export function LoggedInUserItem() {
  const t = useI18n().pack.navigation.loggedIn;
  const sitemap = useSitemap();
  const { session, sdks } = useSdkForLoggedIn();

  return (
    <>
      <LoggedInButton />
      <div className="uk-drop uk-dropdown" uk-dropdown="mode: click">
        <ul className="uk-dropdown-nav uk-nav">
          <li className="p-3 text-sm">
            <div className="flex flex-col space-y-1.5">
              <p className="font-medium text-sm uk-text-capitalize leading-none">
                {session.token.role}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {session.token.email}
              </p>
            </div>
          </li>

          <li className="uk-nav-divider" />

          <li>
            <Link
              className="justify-between"
              href={sitemap.settings}
            >
              <span className="flex items-center gap-2">
                <Settings size={16} />
                {t.settings}
              </span>
            </Link>
          </li>

          <li>
            <a
              className="justify-between uk-drop-close"
              type="button"
              href=""
              onClick={sdks.auth.logOut}
            >
              <span className="flex items-center gap-2">
                <LogOut size={16} />
                {t.logout}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
