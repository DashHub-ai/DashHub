import { z } from 'zod';

export const SdkStrictJsonV = z.string()
  .transform((str, ctx): z.infer<any> => {
    try {
      return JSON.parse(str);
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (_: any) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
      return z.NEVER;
    }
  });
