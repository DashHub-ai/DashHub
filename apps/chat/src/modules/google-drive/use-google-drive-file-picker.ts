import { useRef } from 'react';

import {
  injectScriptsInParallel,
  preloadResources,
  useAfterMount,
  useAsyncCallback,
} from '@llm/commons-front';
import { useConfig } from '~/config';

const DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
];

const GOOGLE_API_SCRIPTS = [
  'https://apis.google.com/js/api.js',
  'https://accounts.google.com/gsi/client',
];

const BINARY_MIME_TYPES = [
  'application/pdf', // .pdf
  'text/csv', // .csv
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'image/png', // .png
  'image/jpeg', // .jpg, .jpeg
  'image/bmp', // .bmp
  'text/plain', // .txt
  'text/html', // .html
  'text/markdown', // .md
];

export function useGoogleDriveFilePicker() {
  const { googleDrive } = useConfig();
  const oauthAccessTokenRef = useRef<string | null>(null);

  useAfterMount(() => {
    preloadResources(GOOGLE_API_SCRIPTS);
  });

  const requestOAuthAccessToken = async () => {
    if (!googleDrive) {
      throw new Error('Google Drive is not configured.');
    }

    if (oauthAccessTokenRef.current) {
      return oauthAccessTokenRef.current;
    }

    const { clientId } = googleDrive;
    const { access_token: oAuthToken } = await new Promise<google.accounts.oauth2.TokenResponse>((resolve, reject) => {
      try {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: DEFAULT_SCOPES.join(' '),
          callback: resolve,
        });

        tokenClient.requestAccessToken({
          prompt: 'consent',
        });
      }
      catch (error) {
        console.error(error);
        reject(error);
      }
    });

    oauthAccessTokenRef.current = oAuthToken;
    return oAuthToken;
  };

  return useAsyncCallback(async () => {
    if (!googleDrive) {
      throw new Error('Google Drive is not configured.');
    }

    await injectScriptsInParallel(GOOGLE_API_SCRIPTS);
    await new Promise(resolve => gapi.load('picker', resolve));

    const oAuthAccessToken = await requestOAuthAccessToken();

    const docsView = new google.picker.DocsView()
      .setIncludeFolders(true)
      .setMimeTypes(BINARY_MIME_TYPES.join(','));

    const filePickerBuilder = new google.picker.PickerBuilder()
      .addView(docsView)
      .setOAuthToken(oAuthAccessToken)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED);

    return new Promise<File[]>((resolve, reject) => {
      const onPickerCallback = async (data: google.picker.ResponseObject) => {
        if (data.action === google.picker.Action.PICKED && data.docs && data.docs.length > 0) {
          try {
            const downloadPromises = data.docs.map(downloadGoogleDriveFile(oAuthAccessToken));
            const files = await Promise.all(downloadPromises);

            resolve(files);
          }
          catch (error) {
            console.error('Error downloading files:', error);
            reject(error);
          }
        }
        else if ([google.picker.Action.CANCEL, google.picker.Action.ERROR].includes(data.action as any)) {
          resolve([]);
        }
      };

      try {
        filePickerBuilder
          .setCallback(onPickerCallback)
          .build()
          .setVisible(true);
      }
      catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });
}

function downloadGoogleDriveFile(oAuthAccessToken: string) {
  return async ({ id, name, mimeType }: google.picker.DocumentObject): Promise<File> => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
      headers: {
        Authorization: `Bearer ${oAuthAccessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();

    return new File([blob], name || 'file', { type: mimeType });
  };
}
