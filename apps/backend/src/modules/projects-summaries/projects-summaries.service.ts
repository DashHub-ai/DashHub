import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import {
  asyncIteratorToVoidPromise,
  pluck,
  pluckTyped,
  tapAsyncIterator,
  tapTaskEither,
  tapTaskEitherError,
} from '@llm/commons';

import { AIConnectorService } from '../ai-connector';
import { AIModelsService } from '../ai-models';
import { ChatsEsSearchRepo } from '../chats/elasticsearch';
import { TableId, TableRowWithId } from '../database';
import { LoggerService } from '../logger';
import { ProjectsEsIndexRepo } from '../projects/elasticsearch';
import { ProjectsSummariesRepo } from './projects-summaries.repo';

@injectable()
export class ProjectsSummariesService {
  private readonly logger = LoggerService.of('ProjectsSummariesService');

  constructor(
    @inject(ProjectsSummariesRepo) private readonly repo: ProjectsSummariesRepo,
    @inject(ProjectsEsIndexRepo) private readonly projectsEsIndexRepo: ProjectsEsIndexRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
    @inject(ChatsEsSearchRepo) private readonly chatsEsSearchRepo: ChatsEsSearchRepo,
  ) {}

  summarizeProjects = ({ ids }: { ids: TableId[]; }) => pipe(
    ids,
    A.map(id => this.summarizeProjectAndUpdate({ id })),
    TE.sequenceSeqArray,
  );

  summarizeAllProjects = () => pipe(
    this.repo.getTotalProjectsToSummarize(),
    tapTaskEither((total) => {
      this.logger.info('Total projects to summarize:', { total });
    }),
    TE.chainW(() => TE.fromTask(() => pipe(
      this.repo.createProjectsToSummarizeIterator(),
      tapAsyncIterator(async (projects) => {
        this.logger.info('Summarizing projects', { projects: pluck('projectId')(projects) });

        await pipe(
          projects,
          A.map(summary => pipe(
            this.summarizeProjectAndUpdate({
              id: summary.projectId,
            }),
            tapTaskEitherError((error) => {
              this.logger.error('Failed to summarize project', { error, summary });
            }),
            TE.orElseW(() => TE.right(undefined)),
          )),
          TE.sequenceSeqArray,
        )();
      }),
      asyncIteratorToVoidPromise,
    ))),
  );

  private summarizeProjectAndUpdate = ({ id }: TableRowWithId) => pipe(
    TE.Do,
    TE.apS('aiModel', pipe(
      this.projectsEsIndexRepo.getDocument(id),
      TE.chainW(({ organization }) => this.aiModelsService.getDefault(organization.id)),
    )),
    TE.apSW('chatsSummaries', pipe(
      this.chatsEsSearchRepo.search({
        archived: false,
        limit: 6,
        offset: 0,
        sort: 'createdAt:desc',
        projectsIds: [id],
      }),
      TE.map(({ items }) => pipe(items, pluckTyped('summary'))),
    )),
    TE.chainW(({ aiModel, chatsSummaries }) => pipe(
      this.aiConnectorService.executeInstructedPrompt({
        aiModel,
        schema: z.object({
          description: z.string(),
        }),
        message: [
          'Create a concise project description based on the conversations and topics discussed in this project.',
          'Requirements:',
          '- Focus on what this project is about, its main goals, and key technical aspects.',
          '- Use the same language as that one used in the conversations.',
          '- Max. 2 short sentences, keep it as short as possible.',
          '- You can use emojis.',
          '- Do not include requirements in generated description.',
          '\n--\n',
          'Project conversations:',
          ...chatsSummaries.flatMap(({ content, name }) => {
            if (!name.value && !content.value) {
              return [];
            }

            return [
              `- Chat: ${name.value || '-'}: ${content.value || '-'}`,
            ];
          }),
        ].join('\n'),
      }),
    )),
    TE.orElseW((error) => {
      this.logger.error('Failed to summarize project', { error });

      return TE.of({
        description: 'Cannot summarize project. Please do it manually.',
      });
    }),
    TE.chainW(summarize => this.repo.updateGeneratedSummarizeByProjectId(
      {
        projectId: id,
        content: summarize.description,
      },
    )),
    TE.tap(() => this.projectsEsIndexRepo.findAndIndexDocumentById(id)),
  );
}
