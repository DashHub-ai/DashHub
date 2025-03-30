import { injectScriptsInParallel, useAsyncCallback } from '@llm/commons-front';
import { useConfig } from '~/config';

const DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
];

export function useGoogleDriveFilePicker() {
  const { googleDrive } = useConfig();

  return useAsyncCallback(async () => {
    if (!googleDrive) {
      throw new Error('Google Drive is not configured.');
    }

    const { appId, apiKey, clientId } = googleDrive;

    await injectScriptsInParallel([
      'https://apis.google.com/js/api.js',
      'https://accounts.google.com/gsi/client',
    ]);

    const { access_token: oAuthToken } = await new Promise<google.accounts.oauth2.TokenResponse>((resolve) => {
      google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: DEFAULT_SCOPES.join(' '),
        callback: resolve,
      });
    });

    return new Promise<any>((resolve, reject) => {
      try {
        const filePicker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS)
          .setDeveloperKey(apiKey)
          .setAppId(appId)
          .setOAuthToken(oAuthToken)
          .setCallback((data: unknown) => {
            resolve(data);
          })
          .build();

        filePicker?.setVisible(true);
      }
      catch (error) {
        reject(error);
      }
    });
  });
}
