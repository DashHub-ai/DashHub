import UIKit from 'uikit';

import { useI18n } from '~/i18n';

export function useSaveSuccessNotification() {
  const t = useI18n().pack.notifications.save;

  return () => {
    UIKit.notification({
      message: t.success,
      status: 'primary',
      pos: 'top-center',
      timeout: 3000,
    });
  };
}
