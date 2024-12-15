import { File, FileText, FileVideo, Image, Music } from 'lucide-react';

type FileTypeIconProps = {
  fileName: string;
  className?: string;
};

export function FileTypeIcon({ fileName, className }: FileTypeIconProps) {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
    return <Image className={className} />;
  }

  // Document files
  if (['doc', 'docx', 'pdf', 'txt', 'rtf'].includes(extension)) {
    return <FileText className={className} />;
  }

  // Audio files
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
    return <Music className={className} />;
  }

  // Video files
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return <FileVideo className={className} />;
  }

  // Default file icon
  return <File className={className} />;
}
