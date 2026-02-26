import { z } from 'zod';

const imageSchema = z.object({
  _type: z.literal('image'),
  asset: z.object({
    _type: z.string(),
    _ref: z.string(),
  }),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export default imageSchema;

export type Image = z.infer<typeof imageSchema>;
