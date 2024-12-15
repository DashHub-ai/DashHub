import { PaperclipIcon } from 'lucide-react';

import { SdkSearchProjectFilesInputV, type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';
import { FormSpinnerCTA, PaginatedList, useDebouncedPaginatedSearch } from '@llm/ui';
import { useI18n } from '~/i18n';

import { FileCard } from './file-card';
import { FilesPlaceholder } from './files-placeholder';
import { useFileUpload } from './use-file-upload';

type Props = {
  projectId: SdkTableRowIdT;
};

export function FilesListContainer({ projectId }: Props) {
  const t = useI18n().pack.projects.files;
  const [uploadFile, uploadState] = useFileUpload(projectId);

  const { sdks } = useSdkForLoggedIn();
  const { result, loading, pagination, silentReload } = useDebouncedPaginatedSearch({
    storeDataInUrl: false,
    schema: SdkSearchProjectFilesInputV,
    fallbackSearchParams: {
      limit: 12,
    },
    fetchResultsTask: filters => sdks.dashboard.projects.files.search({
      ...filters,
      projectId,
    }),
  });

  const handleUpload = async () => {
    await uploadFile();
    silentReload();
  };

  const handleDelete = (id: SdkTableRowIdT) => {
    // eslint-disable-next-line no-console
    console.log('Delete file:', id);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-semibold text-gray-800 text-xl">Files</h2>
        <FormSpinnerCTA
          type="button"
          loading={uploadState.isLoading}
          onClick={() => void handleUpload()}
          className="flex items-center uk-button-small"
        >
          {!uploadState.isLoading && <PaperclipIcon size={16} className="mr-2" />}
          {t.upload}
        </FormSpinnerCTA>
      </div>

      <div className="space-y-3">
        <PaginatedList
          result={result}
          loading={loading}
          pagination={pagination.bind.entire()}
          withEmptyPlaceholder={false}
          footerProps={{
            withNthToNthOf: false,
            withPageSizeSelector: false,
          }}
        >
          {({ items, total }) => {
            if (!total) {
              return <FilesPlaceholder />;
            }

            return items.map(file => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={() => handleDelete(file.id)}
              />
            ));
          }}
        </PaginatedList>
      </div>
    </section>
  );
}