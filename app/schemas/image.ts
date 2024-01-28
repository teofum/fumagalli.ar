import { z } from 'zod';

const imageSchema = z.object({
  _type: z.literal('image'),
  asset: z.object({
    _type: z.string(),
    _ref: z.string(),
  }),
});

export default imageSchema;

export type Image = z.infer<typeof imageSchema>;
