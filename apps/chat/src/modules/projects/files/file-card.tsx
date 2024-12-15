import { pipe } from 'fp-ts/lib/function';
import { Download, Trash2 } from 'lucide-react';

import { tapTaskEither } from '@llm/commons';
import { type SdkBaseS3FileT, type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';
import { useDeleteWithNotifications } from '@llm/ui';
import { useI18n } from '~/i18n';

import { FileTypeIcon } from './file-type-icon';

type FileCardProps = {
  projectId: SdkTableRowIdT;
  file: SdkBaseS3FileT;
  onAfterDelete: () => void;
};

export function FileCard({ projectId, file, onAfterDelete }: FileCardProps) {
  const t = useI18n().pack.projects.files;
  const { sdks } = useSdkForLoggedIn();
  const [onDelete, deleteStatus] = useDeleteWithNotifications(
    pipe(
      sdks.dashboard.projects.files.delete({
        projectId,
        resourceId: file.id,
      }),
      tapTaskEither(onAfterDelete),
    ),
  );

  return (
    <div className="flex items-center border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50 mb-2 p-3 border rounded-lg transition-all group">
      <FileTypeIcon fileName={file.name} className="mr-3 w-5 h-5 text-gray-500" />

      <span className="flex-1 font-medium text-gray-700 text-sm truncate">
        {file.name}
      </span>

      <div className="flex gap-1 transition-all">
        <a
          className="hover:bg-gray-100 p-1.5 rounded-md text-gray-500 hover:text-gray-900 transition-colors"
          title={t.download}
          href={file.publicUrl}
        >
          <Download className="w-4 h-4" />
        </a>

        <button
          onClick={() => void onDelete()}
          disabled={deleteStatus.loading}
          className="hover:bg-red-50 p-1.5 rounded-md text-gray-500 hover:text-red-600 transition-colors"
          title={t.delete}
          type="button"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
