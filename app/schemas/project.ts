import { z } from 'zod';
import blockSchema from './block';
import codeSchema from './code';
import imageSchema from './image';

export const projectSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const fullProjectSchema = projectSchema.extend({
  content: z.union([blockSchema, imageSchema, codeSchema]).array(),
});
