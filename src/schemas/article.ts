import { z } from 'zod';

import blockSchema from './block';
import codeSchema from './code';
import imageSchema from './image';

export const articleSchema = z
  .object({
    _id: z.string(),
    title: z.string(),
    slug: z.string(),
    tags: z.string().array(),
    thumbnail: imageSchema.optional(),
    description: z.string().optional(),
    legacyDate: z.string().nullable(),
    fileDate: z.string(),
  })
  .transform(({ legacyDate, fileDate, ...article }) => ({
    ...article,
    date: new Date(legacyDate ?? fileDate),
  }));

export const fullArticleSchema = articleSchema.and(
  z.object({
    content: z
      .union([
        blockSchema,
        imageSchema.extend({
          alt: z.string().optional(),
          caption: z.string().optional(),
        }),
        codeSchema,
      ])
      .array(),
  }),
);

export type Article = z.infer<typeof articleSchema>;
export type ArticleWithContent = z.infer<typeof fullArticleSchema>;
