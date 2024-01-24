import { z } from 'zod';
import fileSchema from './file';

const baseFolderSchema = z.object({
  _id: z.string(),
  _type: z.literal('folder'),
  _createdAt: z.coerce.date(),
  _updatedAt: z.coerce.date(),
  name: z.string(),
  items: z.unknown().array().optional(),
});

type ParentFolder = Omit<z.infer<typeof baseFolderSchema>, 'items'> & {
  parent?: ParentFolder;
};

const parentFolderSchema: z.ZodType<ParentFolder> = z.object({
  _id: z.string(),
  _type: z.literal('folder'),
  _createdAt: z.coerce.date(),
  _updatedAt: z.coerce.date(),
  name: z.string(),
  parent: z.lazy(() => parentFolderSchema.optional()),
});

const folderSchema = baseFolderSchema.extend({
  items: z.lazy(() =>
    z.union([baseFolderSchema, fileSchema]).array().optional(),
  ),
  parent: parentFolderSchema.optional(),
});

export default folderSchema;

export type Folder = z.infer<typeof folderSchema>;
