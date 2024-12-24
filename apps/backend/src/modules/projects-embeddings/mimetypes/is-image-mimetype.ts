const SUPPORTED_IMAGES_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export function isImageMimetype(mimetype: string): boolean {
  return SUPPORTED_IMAGES_MIME_TYPES.has(mimetype);
}
