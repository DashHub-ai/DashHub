import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';

import { LoggedInButton } from './logged-in-button';

export function LoggedInUserItem() {
  const t = useI18n().pack.navigation.loggedIn;
  const { session, sdks } = useSdkForLoggedIn();

  return (
    <>
      <LoggedInButton />
      <div className="uk-drop uk-dropdown" uk-dropdown="mode: click">
        <ul className="uk-dropdown-nav uk-nav">
          <li className="p-3 text-sm">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none uk-text-capitalize">
                {session.token.role}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.token.email}
              </p>
            </div>
          </li>
          <li className="uk-nav-divider" />
          <li>
            <a
              className="uk-drop-close justify-between"
              type="button"
              href=""
              onClick={sdks.auth.logOut}
            >
              {t.logout}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
