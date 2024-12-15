import { Download, FileText, Trash2 } from 'lucide-react';

import { useI18n } from '~/i18n';

type FileCardProps = {
  name: string;
  onDelete: () => void;
  onDownload: () => void;
};

export function FileCard({ name, onDelete, onDownload }: FileCardProps) {
  const t = useI18n().pack.projects.files;

  return (
    <div className="flex items-center border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50 mb-2 p-3 border rounded-lg transition-all group">
      <FileText className="mr-3 w-4 h-4 text-gray-500" />

      <span className="flex-1 font-medium text-gray-700 text-sm truncate">
        {name}
      </span>

      <div className="flex gap-1 transition-all">
        <button
          onClick={onDownload}
          className="hover:bg-gray-100 p-1.5 rounded-md text-gray-500 hover:text-gray-900 transition-colors"
          title={t.download}
          type="button"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={onDelete}
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
