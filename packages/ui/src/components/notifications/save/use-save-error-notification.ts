import UIKit from 'uikit';

import type { TaggedError } from '@llm/commons';

import { useSdkErrorTranslator } from '~/hooks';
import { useForwardedI18n } from '~/i18n';

export function useSaveErrorNotification() {
  const { pack } = useForwardedI18n();
  const { unsafeTranslate } = useSdkErrorTranslator();

  return (error: TaggedError<string>) => {
    const errorMessage = unsafeTranslate(error);
    let message = pack.notifications.save.error;

    if (errorMessage) {
      message = `${message}: ${errorMessage}`;
    }

    UIKit.notification({
      message,
      status: 'danger',
      pos: 'top-center',
      timeout: 3000,
    });
  };
}
