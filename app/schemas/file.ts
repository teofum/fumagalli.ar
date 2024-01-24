import { z } from 'zod';
import imageSchema from './image';
import blockSchema from './block';

const baseFileSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  name: z.string(),
});

const richTextFileSchema = baseFileSchema.extend({
  _type: z.literal('fileRichText'),
  content: z.union([blockSchema, imageSchema]).array(),
});

export type RichTextFile = z.infer<typeof richTextFileSchema>;

const imageFileSchema = baseFileSchema.extend({
  _type: z.literal('fileImage'),
  content: imageSchema,
});

export type ImageFile = z.infer<typeof imageFileSchema>;

const fileSchema = z.union([imageFileSchema, richTextFileSchema]);

export default fileSchema;

export type AnyFile = ImageFile | RichTextFile;
