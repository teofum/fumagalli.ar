import { z } from 'zod';
import fileSchema from './file';

const baseFolderSchema = z.object({
  _id: z.string(),
  _type: z.literal('folder'),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  name: z.string(),
});

type ParentFolder = z.infer<typeof baseFolderSchema> & {
  parent?: ParentFolder;
};

const parentFolderSchema: z.ZodType<ParentFolder> = baseFolderSchema.extend({
  parent: z.lazy(() => parentFolderSchema.optional()),
});

const childFolderSchema = baseFolderSchema.extend({
  items: z.any().array().optional(),
});

const folderSchema = baseFolderSchema.extend({
  items: z.lazy(() =>
    z.union([childFolderSchema, fileSchema]).array().optional(),
  ),
  parent: parentFolderSchema.optional(),
});

export default folderSchema;

export type Folder = z.infer<typeof folderSchema>;
