import { Buffer } from 'node:buffer';

import { either as E } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import { tryParseUsingZodSchema } from '@llm/commons';
import {
  type ProjectsSdk,
  SdkCreateProjectInputV,
  SdkInvalidRequestError,
  SdKSearchProjectsInputV,
  SdkUpdateProjectInputV,
} from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { ProjectsService } from '~/modules/projects';
import { ProjectsFilesService } from '~/modules/projects-files';

import {
  mapDbRecordAlreadyExistsToSdkError,
  mapDbRecordNotFoundToSdkError,
  rejectUnsafeSdkErrors,
  respondWithTaggedError,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class ProjectsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(ProjectsService) projectsService: ProjectsService,
    @inject(ProjectsFilesService) projectsFilesService: ProjectsFilesService,
  ) {
    super(configService);

    this.router
      .post(
        '/:projectId/files',
        async (context) => {
          const result = pipe(
            await context.req.parseBody(),
            tryParseUsingZodSchema(z.object({
              file: z.instanceof(File),
            })),
          );

          if (E.isLeft(result)) {
            return pipe(
              new SdkInvalidRequestError(result.left.context),
              respondWithTaggedError(context),
            );
          }

          return pipe(
            projectsFilesService.asUser(context.var.jwt).uploadFile({
              projectId: Number(context.req.param().projectId),
              buffer: Buffer.from(await result.right.file.arrayBuffer()),
              fileName: result.right.file.name,
            }),
            rejectUnsafeSdkErrors,
            serializeSdkResponseTE<ReturnType<ProjectsSdk['uploadFile']>>(context),
          );
        },
      )
      .get(
        '/search',
        sdkSchemaValidator('query', SdKSearchProjectsInputV),
        async context => pipe(
          context.req.valid('query'),
          projectsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ProjectsSdk['search']>>(context),
        ),
      )
      .get(
        '/:id',
        async context => pipe(
          context.req.param('id'),
          projectsService.asUser(context.var.jwt).get,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ProjectsSdk['get']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateProjectInputV),
        async context => pipe(
          context.req.valid('json'),
          projectsService.asUser(context.var.jwt).create,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ProjectsSdk['create']>>(context),
        ),
      )
      .patch(
        '/archive/:id',
        async context => pipe(
          Number(context.req.param().id),
          projectsService.asUser(context.var.jwt).archive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ProjectsSdk['archive']>>(context),
        ),
      )
      .patch(
        '/unarchive/:id',
        async context => pipe(
          Number(context.req.param().id),
          projectsService.asUser(context.var.jwt).unarchive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ProjectsSdk['unarchive']>>(context),
        ),
      )
      .put(
        '/:id',
        sdkSchemaValidator('json', SdkUpdateProjectInputV),
        async context => pipe(
          {
            id: Number(context.req.param().id),
            ...context.req.valid('json'),
          },
          projectsService.asUser(context.var.jwt).update,
          mapDbRecordAlreadyExistsToSdkError,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ProjectsSdk['update']>>(context),
        ),
      );
  }
}
