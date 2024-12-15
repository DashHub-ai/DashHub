import { PaperclipIcon } from 'lucide-react';

import type { SdkTableRowIdT } from '@llm/sdk';

import { FormSpinnerCTA } from '@llm/ui';
import { useI18n } from '~/i18n';

import { FileCard } from './file-card';
import { useFileUpload } from './use-file-upload';

const MOCK_FILES = [
  { id: '1', name: 'document.pdf' },
  { id: '2', name: 'image.png' },
  { id: '3', name: 'report.docx' },
];

type FileListProps = {
  projectId: SdkTableRowIdT;
};

export function FileList({ projectId }: FileListProps) {
  const t = useI18n().pack.projects.files;
  const [uploadFile, uploadState] = useFileUpload(projectId);

  const handleDelete = (id: string) => {
    // eslint-disable-next-line no-console
    console.log('Delete file:', id);
  };

  const handleDownload = (id: string) => {
    // eslint-disable-next-line no-console
    console.log('Download file:', id);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-semibold text-gray-800 text-xl">Files</h2>
        <FormSpinnerCTA
          type="button"
          loading={uploadState.isLoading}
          onClick={() => void uploadFile()}
          className="flex items-center uk-button-small"
        >
          {!uploadState.isLoading && <PaperclipIcon size={16} className="mr-2" />}
          {t.upload}
        </FormSpinnerCTA>
      </div>

      <div className="space-y-3">
        {MOCK_FILES.map(file => (
          <FileCard
            key={file.id}
            name={file.name}
            onDelete={() => handleDelete(file.id)}
            onDownload={() => handleDownload(file.id)}
          />
        ))}
      </div>
    </section>
  );
}
