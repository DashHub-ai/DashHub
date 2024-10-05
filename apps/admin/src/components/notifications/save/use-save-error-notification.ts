import UIKit from 'uikit';

import { useI18n } from '~/i18n';

export function useSaveErrorNotification() {
  const t = useI18n().pack.notifications.save;

  return () => {
    UIKit.notification({
      message: t.error,
      status: 'danger',
      pos: 'top-center',
      timeout: 3000,
    });
  };
}
