import { clsx } from 'clsx';
import { PaperclipIcon } from 'lucide-react';

import { SdkSearchProjectFilesInputV, type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { FormSpinnerCTA, PaginatedList, useDebouncedPaginatedSearch } from '~/ui';

import { ProjectFileCard } from './project-file-card';
import { ProjectFilesPlaceholder } from './project-files-placeholder';
import { useFileUpload } from './use-file-upload';

type Props = {
  projectId: SdkTableRowIdT;
  readOnly?: boolean;
  compactView?: boolean;
  columns?: number;
};

export function ProjectFilesListContainer({ projectId, readOnly, compactView, columns = 1 }: Props) {
  const t = useI18n().pack.projects.files;
  const [uploadFile, uploadState] = useFileUpload(projectId);

  const { sdks } = useSdkForLoggedIn();
  const { result, loading, pagination, silentReload } = useDebouncedPaginatedSearch({
    storeDataInUrl: false,
    schema: SdkSearchProjectFilesInputV,
    fallbackSearchParams: {
      limit: compactView ? 10 : 6,
    },
    fetchResultsTask: filters => sdks.dashboard.projectsFiles.search({
      ...filters,
      ignoreAttachedToMessages: true,
      projectId,
    }),
  });

  const handleUpload = async () => {
    await uploadFile();
    silentReload();
  };

  return (
    <section className={compactView ? 'space-y-5' : ''}>
      {!readOnly && (
        <div className={`flex justify-end ${compactView ? 'mb-3' : 'mb-6'}`}>
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
      )}

      <PaginatedList
        result={result}
        loading={loading}
        pagination={pagination.bind.entire()}
        withEmptyPlaceholder={false}
        footerProps={{
          withNthToNthOf: false,
          withPageSizeSelector: false,
          withPageNumber: !compactView,
          centered: true,
        }}
      >
        {({ items, total }) => {
          if (!total) {
            return <ProjectFilesPlaceholder />;
          }

          return (
            <div
              className={clsx(
                'grid grid-cols-1',
                columns === 1 ? 'gap-1' : 'gap-6',
                getGridColumns(columns),
              )}
            >
              {items.map(file => (
                <ProjectFileCard
                  key={file.id}
                  file={file}
                  readOnly={readOnly}
                  onAfterDelete={silentReload}
                  compactView={compactView}
                />
              ))}
            </div>
          );
        }}
      </PaginatedList>
    </section>
  );
}

function getGridColumns(columns: number) {
  switch (columns) {
    case 2:
      return 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2';
    case 3:
      return 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3';
    case 4:
      return 'grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4';
    case 5:
      return 'grid-cols-1 lg:grid-cols-4 2xl:grid-cols-5';
    case 6:
      return 'grid-cols-1 lg:grid-cols-5 2xl:grid-cols-6';
    case 1:
    default:
      return 'grid-cols-1';
  }
}
