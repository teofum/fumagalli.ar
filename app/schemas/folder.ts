import { z } from 'zod';
import imageSchema from './image';

const itemStubSchema = z.object({
  _id: z.string(),
  _type: z.enum(['folder', 'fileImage', 'fileRichText', 'fileApp', 'fileDos']),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  name: z.string(),
  icon: z
    .object({
      icon16: imageSchema,
      icon32: imageSchema,
    })
    .optional(),
  size: z.number().optional(),
});

export type ItemStub = z.infer<typeof itemStubSchema>;

const baseFolderSchema = itemStubSchema.extend({
  _type: z.literal('folder'),
});

type ParentFolder = z.infer<typeof baseFolderSchema> & {
  parent?: ParentFolder;
};

const parentFolderSchema: z.ZodType<ParentFolder> = baseFolderSchema.extend({
  parent: z.lazy(() => parentFolderSchema.optional()),
});

const folderSchema = baseFolderSchema.extend({
  items: itemStubSchema.array().optional(),
  parent: parentFolderSchema.optional(),
});

export default folderSchema;

export type Folder = z.infer<typeof folderSchema>;
