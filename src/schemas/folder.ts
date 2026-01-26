import { z } from 'zod';
import imageSchema from './image';

const itemStubSchema = z.object({
  _id: z.string(),
  _type: z.enum([
    'folder',
    'fileImage',
    'fileRichText',
    'fileApp',
    'fileDos',
    'fileMDX',
  ]),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  name: z.string(),
  icon: z
    .object({
      icon16: imageSchema,
      icon32: imageSchema,
    })
    .nullish(),
  size: z.number().nullish(),
});

export type ItemStub = z.infer<typeof itemStubSchema>;

const baseFolderSchema = itemStubSchema.extend({
  _type: z.literal('folder'),
});

type ParentFolder = z.infer<typeof baseFolderSchema> & {
  parent?: ParentFolder | null;
};

const parentFolderSchema: z.ZodType<ParentFolder> = baseFolderSchema.extend({
  parent: z.lazy(() => parentFolderSchema.nullish()),
});

const folderSchema = baseFolderSchema.extend({
  items: itemStubSchema.array().nullish(),
  parent: parentFolderSchema.nullish(),
});

export default folderSchema;

export type Folder = z.infer<typeof folderSchema>;
