import UIKit from 'uikit';

import { useForwardedI18n } from '~/i18n';

export function useSaveSuccessNotification() {
  const t = useForwardedI18n().pack.notifications.save;

  return () => {
    UIKit.notification({
      message: t.success,
      status: 'primary',
      pos: 'top-center',
      timeout: 3000,
    });
  };
}
