import { Globe2, XIcon } from 'lucide-react';

import { useI18n } from '~/i18n';

type ChatCodeBrowserPreviewProps = {
  content: string;
  onClose: () => void;
};

export function ChatCodeBrowserPreview({ content, onClose }: ChatCodeBrowserPreviewProps) {
  const t = useI18n().pack.chat.widgets.code;

  return (
    <div className="border-t">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <div className="items-center gap-2 grid grid-cols-[auto_1fr_auto]">
          <div className="flex gap-1.5">
            <div className="bg-red-400 rounded-full w-3 h-3" />
            <div className="bg-yellow-400 rounded-full w-3 h-3" />
            <div className="bg-green-400 rounded-full w-3 h-3" />
          </div>
          <div className="flex justify-center">
            <div className="min-w-[300px]">
              <div className="flex items-center bg-white px-3 py-1 rounded-lg text-gray-600 text-sm">
                <Globe2 className="mr-2 w-4 h-4 shrink-0" />
                <span className="flex-1 text-center">{t.preview.addressBar}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-red-500 p-1 rounded-full hover:text-white transition-colors"
            aria-label="Close preview"
          >
            <XIcon size={14} />
          </button>
        </div>
      </div>

      <iframe
        srcDoc={content}
        className="bg-white w-full h-[500px]"
        sandbox="allow-scripts"
        title="HTML Preview"
      />
    </div>
  );
}
