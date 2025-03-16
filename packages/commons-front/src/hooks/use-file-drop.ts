import { suppressEvent } from '@under-control/forms';
import { useState } from 'react';

export type UseFileDropProps = {
  onDrop: (files: File[]) => void;
  acceptedFileTypes: string[];
};

export function useFileDrop({ onDrop, acceptedFileTypes }: UseFileDropProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    suppressEvent(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    suppressEvent(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    suppressEvent(e);
    setIsDragging(false);

    const { files } = e.dataTransfer;

    if (!files || files.length === 0)
      return;

    const validFiles = Array.from(files).filter((file) => {
      if (!acceptedFileTypes || acceptedFileTypes.length === 0) {
        return true;
      }

      // Check if the file extension is in the accepted types
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return acceptedFileTypes.some(type => type.toLowerCase() === fileExt);
    });

    if (validFiles.length > 0) {
      onDrop(validFiles);
    }
  };

  return {
    listeners: {
      onDragOver: handleDragEnter,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    isDragging,
  };
}
