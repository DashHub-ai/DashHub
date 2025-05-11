import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  ofSdkSuccess,
  type PinnedMessagesSdk,
  SdkPinMessageInputV,
  SdkSearchPinnedMessagesInputV,
} from '@dashhub/sdk';
import { ConfigService } from '~/modules/config';
import { PinnedMessagesService } from '~/modules/pinned-messages';

import {
  mapDbRecordAlreadyExistsToSdkError,
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class PinnedMessagesController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(PinnedMessagesService) pinnedMessagesService: PinnedMessagesService,
  ) {
    super(configService);

    this.router
      .get(
        '/search',
        sdkSchemaValidator('query', SdkSearchPinnedMessagesInputV),
        async context => pipe(
          context.req.valid('query'),
          pinnedMessagesService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<PinnedMessagesSdk['search']>>(context),
        ),
      )
      .get(
        '/all',
        async context => pipe(
          pinnedMessagesService.asUser(context.var.jwt).findAll(),
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<PinnedMessagesSdk['all']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkPinMessageInputV),
        async context => pipe(
          context.req.valid('json'),
          pinnedMessagesService.asUser(context.var.jwt).create,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<PinnedMessagesSdk['create']>>(context),
        ),
      )
      .delete(
        '/:id',
        async context => pipe(
          Number(context.req.param('id')),
          pinnedMessagesService.asUser(context.var.jwt).delete,
          TE.map(ofSdkSuccess),
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<PinnedMessagesSdk['delete']>>(context),
        ),
      );
  }
}
