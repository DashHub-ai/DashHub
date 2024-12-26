import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateProjectInputT,
  SdkJwtTokenT,
  SdkUpdateProjectInputT,
} from '@llm/sdk';

import {
  asyncIteratorToVoidPromise,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId, TableRowWithId, TableUuid } from '../database';

import { ChatsService } from '../chats/chats.service';
import { ProjectsEsIndexRepo, ProjectsEsSearchRepo } from './elasticsearch';
import { ProjectsFirewall } from './projects.firewall';
import { ProjectsRepo } from './projects.repo';

@injectable()
export class ProjectsService implements WithAuthFirewall<ProjectsFirewall> {
  constructor(
    @inject(ProjectsRepo) private readonly repo: ProjectsRepo,
    @inject(ProjectsEsSearchRepo) private readonly esSearchRepo: ProjectsEsSearchRepo,
    @inject(ProjectsEsIndexRepo) private readonly esIndexRepo: ProjectsEsIndexRepo,
    @inject(ChatsService) private readonly chatsService: ChatsService,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ProjectsFirewall(jwt, this);

  get = this.esSearchRepo.get;

  unarchive = (id: TableId) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archive = (id: TableId) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  ensureChatHasProjectOrCreateInternal = (chatId: TableUuid) => pipe(
    this.chatsService.get(chatId),
    TE.chainW((chat) => {
      if (chat.project) {
        return TE.right(chat.project);
      }

      return pipe(
        this.create({
          internal: true,
          organization: chat.organization,
          name: `Unnamed Project - ${Date.now()}`,
          description: null,
        }),
        TE.tap(project => this.chatsService.assignToProject(chatId, project.id)),
      );
    }),
  );

  archiveSeqByOrganizationId = (organizationId: TableId) => TE.fromTask(
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

  search = this.esSearchRepo.search;

  create = ({ internal, organization, ...values }: SdkCreateProjectInputT & { internal?: boolean; }) => pipe(
    this.repo.create({
      value: {
        ...values,
        internal: !!internal,
        organizationId: organization.id,
      },
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateProjectInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
