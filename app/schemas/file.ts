import { z } from 'zod';
import imageSchema from './image';

const imageFileSchema = z.object({
  _id: z.string(),
  _type: z.literal('fileImage'),
  _createdAt: z.coerce.date(),
  _updatedAt: z.coerce.date(),
  name: z.string(),
  content: imageSchema,
});

const fileSchema = imageFileSchema; // z.union([imageFileSchema]);

export default fileSchema;

export type AnyFile = z.infer<typeof fileSchema>;
