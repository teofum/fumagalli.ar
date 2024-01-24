import { z } from 'zod';
import fileSchema from './file';

const partialFolderSchema = z.object({
  _id: z.string(),
  _type: z.literal('folder'),
  _createdAt: z.coerce.date(),
  _updatedAt: z.coerce.date(),
  name: z.string(),
  items: z.unknown().array().optional(),
});

const folderSchema = partialFolderSchema.extend({
  items: z.union([partialFolderSchema, fileSchema]).array().optional(),
  parent: partialFolderSchema.optional(),
});

export default folderSchema;
