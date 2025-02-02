import clsx from 'clsx';
import { pipe } from 'fp-ts/lib/function';
import { Download, Trash2 } from 'lucide-react';

import { isImageFileUrl, tapTaskEither } from '@llm/commons';
import { type SdkSearchProjectFileItemT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { getFileTypeAndColor } from '~/modules/shared/get-file-type-and-color';
import { CardDescription, useDeleteWithNotifications } from '~/ui';

type FileCardProps = {
  readOnly?: boolean;
  file: SdkSearchProjectFileItemT;
  onAfterDelete: () => void;
};

export function ProjectFileCard({ file, readOnly, onAfterDelete }: FileCardProps) {
  const t = useI18n().pack.projects.files;
  const { sdks } = useSdkForLoggedIn();
  const { resource, project, description } = file;
  const [onDelete, deleteStatus] = useDeleteWithNotifications(
    pipe(
      sdks.dashboard.projectsFiles.delete({
        projectId: project.id,
        resourceId: resource.id,
      }),
      tapTaskEither(onAfterDelete),
    ),
  );

  const { type, bgColor, icon: IconComponent } = getFileTypeAndColor(resource.name);
  const isImage = isImageFileUrl(resource.name);

  return (
    <div className="group flex flex-col bg-white shadow-sm mb-2 p-3 border rounded-lg transition-all">
      <div className="flex items-center mb-2">
        <div className="mr-3">
          <div className={clsx('flex items-center p-1 rounded', bgColor)}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex-1 gap-0.5 min-w-0">
          <div className="block font-medium text-gray-700 text-sm truncate">
            {resource.name}
          </div>
          <div className="text-gray-500 text-xs">
            {type}
          </div>
        </div>

        <div className="flex gap-1 transition-all">
          <a
            className="hover:bg-gray-100 p-1.5 rounded-md text-gray-500 hover:text-gray-900 transition-colors"
            title={t.download}
            href={resource.publicUrl}
          >
            <Download className="w-4 h-4" />
          </a>

          {!readOnly && (
            <button
              onClick={() => void onDelete()}
              disabled={deleteStatus.loading}
              className="hover:bg-red-50 p-1.5 rounded-md text-gray-500 hover:text-red-600 transition-colors"
              title={t.delete}
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <CardDescription limitHeight>
        {isImage
          ? (
              <img
                src={resource.publicUrl}
                alt={resource.name}
                className="bg-gray-50 rounded-md w-full h-[128px] object-contain"
              />
            )
          : description}
      </CardDescription>
    </div>
  );
}
