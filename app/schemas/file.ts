import { z } from 'zod';
import imageSchema from './image';
import blockSchema from './block';
import codeSchema from './code';

const baseFileSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  name: z.string(),
  size: z.number().optional(),
});

const richTextFileSchema = baseFileSchema.extend({
  _type: z.literal('fileRichText'),
  content: z.union([blockSchema, imageSchema, codeSchema]).array(),
});

export type RichTextFile = z.infer<typeof richTextFileSchema>;

export const imageFileSchema = baseFileSchema.extend({
  _type: z.literal('fileImage'),
  content: imageSchema,
  lqip: z.string().optional(),
  originalFilename: z.string().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    aspectRatio: z.number(),
  }),
});

export type ImageFile = z.infer<typeof imageFileSchema>;

const appFileSchema = baseFileSchema.extend({ _type: z.literal('fileApp') });

const dosFileSchema = baseFileSchema.extend({ _type: z.literal('fileDos') });

const mdxFileSchema = baseFileSchema.extend({
  _type: z.literal('fileMDX'),
  content: z.object({
    slug: z.string(),
  }),
});

export type MDXFile = z.infer<typeof mdxFileSchema>;

const fileSchema = z.union([
  imageFileSchema,
  richTextFileSchema,
  appFileSchema,
  dosFileSchema,
  mdxFileSchema,
]);

export default fileSchema;

export type AnyFile = z.infer<typeof fileSchema>;
