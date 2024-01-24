import { z } from 'zod';

const blockSchema = z.object({
  _key: z.string(),
  _type: z.string(),
  style: z.string(),
  listItem: z.string().optional(),

  level: z.number().optional(),
  children: z
    .object({
      _key: z.string(),
      _type: z.string(),
      marks: z.unknown().array(),
      text: z.string(),
    })
    .array(),
  markDefs: z.unknown().array(),
});

export default blockSchema;

export type Block = z.infer<typeof blockSchema>;
