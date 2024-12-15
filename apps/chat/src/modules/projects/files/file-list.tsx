import { Plus } from 'lucide-react';

import { useI18n } from '~/i18n';

import { FileCard } from './file-card';

const MOCK_FILES = [
  { id: '1', name: 'document.pdf' },
  { id: '2', name: 'image.png' },
  { id: '3', name: 'report.docx' },
];

export function FileList() {
  const t = useI18n().pack.projects.files;

  const handleUpload = () => {
    // TODO: Implement file upload
    // eslint-disable-next-line no-console
    console.log('Upload new file');
  };

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
        <button
          type="button"
          onClick={handleUpload}
          className="flex items-center gap-2 uk-button uk-button-primary"
        >
          <Plus className="w-5 h-5" />
          {t.upload}
        </button>
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
