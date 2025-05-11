import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { SdkUpsertOrganizationAISettingsInputT } from '@dashhub/sdk';

import { TableRowWithId } from '../database';
import { ProjectsService } from '../projects';
import { OrganizationsAISettingsRepo } from './organizations-ai-settings.repo';

@injectable()
export class OrganizationsAISettingsService {
  constructor(
    @inject(OrganizationsAISettingsRepo) private readonly repo: OrganizationsAISettingsRepo,
    @inject(ProjectsService) private readonly projectsService: ProjectsService,
  ) {}

  getProjectIdByOrganizationIdOrNil = this.repo.getProjectIdByOrganizationIdOrNil;

  getChatContextByOrganizationIdOrNil = this.repo.getChatContextByOrganizationIdOrNil;

  upsert = ({ chatContext, organization }: SdkUpsertOrganizationAISettingsInputT & { organization: TableRowWithId; }) => pipe(
    TE.Do,
    TE.bind('project', () => pipe(
      this.repo.getProjectIdByOrganizationIdOrNil({
        organizationId: organization.id,
      }),
      TE.chainW((projectId) => {
        if (projectId) {
          return TE.right({ id: projectId });
        }

        return this.projectsService.createInternal({
          organization,
        });
      }),
    )),
    TE.chainW(({ project }) => this.repo.upsert({
      value: {
        projectId: project.id,
        organizationId: organization.id,
        chatContext,
      },
    })),
  );
}
