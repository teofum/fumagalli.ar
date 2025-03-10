import { z } from 'zod';
import blockSchema from './block';
import codeSchema from './code';
import imageSchema from './image';

export const projectSchema = z.object({
  _type: z.string(),
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
});


export const fullProjectSchema = projectSchema.extend({
  content: z.union([blockSchema, imageSchema, codeSchema]).array(),
});

export const projectCategorySchema = z.object({
  _type: z.literal('projectCategory'),
  _id: z.string(),
  title: z.string(),
  projects: projectSchema.extend({
    thumbnail: imageSchema.extend({ lqip: z.string().optional() }).nullish(),
  }).array(),
});
