import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';

export class ChatsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/chats';
};
