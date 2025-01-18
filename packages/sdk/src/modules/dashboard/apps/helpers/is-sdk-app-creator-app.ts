export const SDK_MAGIC_APP_NAME = 'App Creator';

export function isSdkAppCreatorApp(app: { name: string; }) {
  return app.name === SDK_MAGIC_APP_NAME;
}
