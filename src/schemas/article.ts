import { z } from 'zod';

import blockSchema from './block';
import codeSchema from './code';
import imageSchema from './image';

export const articleSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  tags: z.string().array(),
  thumbnail: imageSchema.optional(),
  legacyDate: z.string().nullable(),
  fileDate: z.string(),
});

export const fullArticleSchema = articleSchema.extend({
  content: z.union([blockSchema, imageSchema, codeSchema]).array(),
});
