import { z } from 'zod';

export const SdkTranslatedStringV = z.record(z.string(), z.string());

export type SdkTranslatedStringT = z.TypeOf<typeof SdkTranslatedStringV>;

export function sdkPickTranslation(lang: string) {
  return (dto: SdkTranslatedStringT) => dto[lang] ?? dto.en ?? '<NO TRANSLATION>';
}
