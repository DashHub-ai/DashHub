import type { SdkTableRowWithIdT } from '~/shared';

export function getSdkAppMentionInChat(app: SdkTableRowWithIdT): string {
  return `#app:${app.id}`;
}
