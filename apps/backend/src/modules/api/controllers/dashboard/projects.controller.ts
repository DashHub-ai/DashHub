import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  type ProjectsSdk,
  SdkCreateProjectInputV,
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
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { tryExtractSingleFile } from '../../helpers/try-extract-single-file';
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
          return pipe(
            tryExtractSingleFile(await context.req.parseBody()),
            TE.chainW(({ buffer, mimeType }) =>
              projectsFilesService.asUser(context.var.jwt).uploadFile({
                projectId: Number(context.req.param().projectId),
                buffer,
                mimeType,
              }),
            ),
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
