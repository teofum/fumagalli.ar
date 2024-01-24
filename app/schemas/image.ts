import { z } from 'zod';

const imageSchema = z.object({
  _type: z.literal('image'),
  asset: z.object({
    _type: z.string(),
    _ref: z.string(),
  }),
  crop: z
    .object({
      top: z.number(),
      bottom: z.number(),
      left: z.number(),
      right: z.number(),
    })
    .optional(),
  hotspot: z
    .object({
      height: z.number(),
      width: z.number(),
      x: z.number(),
      y: z.number(),
    })
    .optional(),
});

export default imageSchema;

export type Image = z.infer<typeof imageSchema>;
