import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import {
  asyncIteratorToVoidPromise,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@llm/commons';
import {
  SdkAppFromChatV,
  type SdkCreateAppInputT,
  type SdkJwtTokenT,
  type SdkTableRowIdT,
  type SdkUpdateAppInputT,
} from '@llm/sdk';
import { ChatsSummariesService } from '~/modules/chats-summaries';

import type { WithAuthFirewall } from '../auth';
import type { TableId, TableRowWithId, TableUuid } from '../database';

import { ChatsService } from '../chats';
import { PermissionsService } from '../permissions';
import { AppsFirewall } from './apps.firewall';
import { AppsRepo } from './apps.repo';
import { AppsEsIndexRepo, AppsEsSearchRepo } from './elasticsearch';

const APP_SUMMARY_TEMPLATE = [
  'Prompt is the chatContext field. It is a string that represents the context of the conversation.',
  'Generate prompt about this conversation with given format:',
  '**Purpose**: [Summarize the App\'s purpose based on user input, e.g., "Provide feedback on sales calls for sales reps."]',
  '',
  '**Target Audience**: [Specify the user group, e.g., "Sales team members who may not have technical experience."]',
  '',
  '**Expected Input Files**: ',
  '- Input types: [Specify file types like audio files, CSV spreadsheets, or Word documents]',
  '- Sample file provided: [Yes/No]',
  '',
  '**Expected Output Format**: ',
  '- Output type: [Describe expected output, e.g., "Summary of key customer feedback issues," or "Rewritten professional email."]',
  '- Sample format provided: [Yes/No]',
  '',
  '**Response Style**: [Specify response tone, e.g., "Friendly and supportive, like a coach."]',
  '',
  '**Clarification Handling**:',
  '- Always ask for clarification on vague inputs: [Yes]',
  '- Example for handling unclear inputs: [Provide specific example if user gave one, e.g., "Ask for a clearer audio recording if the quality is low."]',
  '',
  '**Sample Scenarios**:',
  '- Scenario 1: [E.g., "Analyze a feedback file and provide top customer concerns."]',
  '- Scenario 2: [E.g., "Rewrite a casual email into a formal, professional tone."]',
  '- Scenario 3: [E.g., "Provide feedback on a sales call, noting strengths and improvement areas."]',
  '',
  '**Feedback Collection**:',
  '- Should the App request feedback to improve responses? [Yes/No]',
].join('\n');

@injectable()
export class AppsService implements WithAuthFirewall<AppsFirewall> {
  constructor(
    @inject(AppsRepo) private readonly repo: AppsRepo,
    @inject(AppsEsSearchRepo) private readonly esSearchRepo: AppsEsSearchRepo,
    @inject(AppsEsIndexRepo) private readonly esIndexRepo: AppsEsIndexRepo,
    @inject(PermissionsService) private readonly permissionsService: PermissionsService,
    @inject(delay(() => ChatsSummariesService)) private readonly chatsSummariesService: Readonly<ChatsSummariesService>,
    @inject(delay(() => ChatsService)) private readonly chatsService: Readonly<ChatsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new AppsFirewall(jwt, this, this.permissionsService, this.chatsService);

  get = this.esSearchRepo.get;

  summarizeChatToApp = (chatId: TableUuid) =>
    this.chatsSummariesService.summarizeChatUsingSchema({
      id: chatId,
      schema: SdkAppFromChatV,
      prompt: APP_SUMMARY_TEMPLATE,
    });

  archiveSeqByOrganizationId = (organizationId: SdkTableRowIdT) => TE.fromTask(
    pipe(
      this.repo.createIdsIterator({
        where: [['organizationId', '=', organizationId]],
        chunkSize: 100,
      }),
      this.archiveSeqStream,
    ),
  );

  archiveSeqStream = (stream: AsyncIterableIterator<TableId[]>) => async () =>
    pipe(
      stream,
      tapAsyncIterator<TableId[], void>(async ids =>
        pipe(
          this.repo.archiveRecords({
            where: [
              ['id', 'in', ids],
              ['archived', '=', false],
            ],
          }),
          TE.tap(() => this.esIndexRepo.findAndIndexDocumentsByIds(ids)),
          tryOrThrowTE,
          runTaskAsVoid,
        ),
      ),
      asyncIteratorToVoidPromise,
    );

  unarchive = (id: SdkTableRowIdT) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archive = (id: SdkTableRowIdT) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  search = this.esSearchRepo.search;

  create = ({ organization, category, permissions, ...values }: SdkCreateAppInputT) => pipe(
    this.repo.create({
      value: {
        ...values,
        organizationId: organization.id,
        categoryId: category.id,
      },
    }),
    TE.tap(({ id }) => {
      if (!permissions) {
        return TE.of(undefined);
      }

      return this.permissionsService.upsert({
        value: {
          resource: { type: 'app', id },
          permissions,
        },
      });
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, category, permissions, ...value }: SdkUpdateAppInputT & TableRowWithId) => pipe(
    this.repo.update({
      id,
      value: {
        ...value,
        categoryId: category.id,
      },
    }),
    TE.tap(() => {
      if (!permissions) {
        return TE.of(undefined);
      }

      return this.permissionsService.upsert({
        value: {
          resource: { type: 'app', id },
          permissions,
        },
      });
    }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
