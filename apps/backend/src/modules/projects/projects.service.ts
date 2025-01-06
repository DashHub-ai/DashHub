import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

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
import type { TableId, TableRowWithId, TableRowWithUuid } from '../database';

import { ChatsService } from '../chats/chats.service';
import { PermissionsService } from '../permissions';
import { ProjectsEsIndexRepo, ProjectsEsSearchRepo } from './elasticsearch';
import { ProjectsFirewall } from './projects.firewall';
import { ProjectsRepo } from './projects.repo';

@injectable()
export class ProjectsService implements WithAuthFirewall<ProjectsFirewall> {
  constructor(
    @inject(ProjectsRepo) private readonly repo: ProjectsRepo,
    @inject(ProjectsEsSearchRepo) private readonly esSearchRepo: ProjectsEsSearchRepo,
    @inject(ProjectsEsIndexRepo) private readonly esIndexRepo: ProjectsEsIndexRepo,
    @inject(PermissionsService) private readonly permissionsService: PermissionsService,
    @inject(delay(() => ChatsService)) private readonly chatsService: Readonly<ChatsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ProjectsFirewall(jwt, this, this.permissionsService);

  get = this.esSearchRepo.get;

  unarchive = (id: TableId) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archive = (id: TableId) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
    TE.tap(() => this.chatsService.archiveSeqByProjectId(id)),
  );

  ensureChatHasProjectOrCreateInternal = (
    {
      creator,
      chat,
    }: {
      creator: TableRowWithId;
      chat: TableRowWithUuid;
    },
  ) => pipe(
    this.chatsService.get(chat.id),
    TE.chainW((chat) => {
      if (chat.project) {
        return TE.right(chat.project);
      }

      return pipe(
        this.create({
          internal: true,
          organization: chat.organization,
          name: `Unnamed Project - ${Date.now()}`,
          summary: {
            content: {
              value: '',
              generated: false,
            },
          },
          // Embeddings are associated with projects, so we need to inherit permissions
          // from the chat to keep them private.
          permissions: chat.permissions?.current ?? [],
          creator,
        }),
        TE.tap(project => this.chatsService.assignToProject(chat.id, project.id)),
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

  create = (
    {
      creator,
      internal,
      organization,
      permissions,
      ...values
    }: SdkCreateProjectInputT & {
      internal?: boolean;
      creator: TableRowWithId;
    },
  ) => pipe(
    this.repo.create({
      value: {
        ...values,
        creator,
        organization,
        internal: !!internal,
      },
    }),
    TE.tap(({ id }) => {
      if (!permissions) {
        return TE.of(undefined);
      }

      return this.permissionsService.upsert({
        value: {
          resource: { type: 'project', id },
          permissions,
        },
      });
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, permissions, ...value }: SdkUpdateProjectInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => {
      if (!permissions) {
        return TE.of(undefined);
      }

      return this.permissionsService.upsert({
        value: {
          resource: { type: 'project', id },
          permissions,
        },
      });
    }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
