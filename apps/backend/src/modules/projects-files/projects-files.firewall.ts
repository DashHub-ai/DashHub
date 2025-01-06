import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { PartialBy } from '@llm/commons';
import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableId, TableUuid } from '../database';
import type { PermissionsService } from '../permissions';
import type { ProjectsService } from '../projects/projects.service';
import type { UploadFileAttrs } from '../s3';
import type { InternalSearchProjectFilesInput } from './elasticsearch';
import type { ProjectsFilesService } from './projects-files.service';

export class ProjectsFilesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly projectsFilesService: ProjectsFilesService,
    private readonly projectsService: Readonly<ProjectsService>,
    private readonly permissionsService: Readonly<PermissionsService>,
  ) {
    super(jwt);
  }

  deleteByProjectResource = (
    attrs: {
      resourceId: TableId;
      projectId: TableId;
    },
  ) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.projectsService.get(attrs.projectId),
    }),
    TE.chainW(() => this.projectsFilesService.deleteByProjectResource(attrs)),
  );

  search = (dto: InternalSearchProjectFilesInput) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'read',
      findRecord: this.projectsService.get(dto.projectId),
    }),
    TE.chainW(() => this.projectsFilesService.search(dto)),
  );

  uploadFile = (
    attrs: PartialBy<UploadFileAttrs, 'bucketId'> & {
      projectId: TableId;
      messageId?: TableUuid;
    },
  ) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'read',
      findRecord: this.projectsService.get(attrs.projectId),
    }),
    TE.chainW(() => this.projectsFilesService.uploadFile(attrs)),
  );
}
