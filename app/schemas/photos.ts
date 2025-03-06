import { z } from 'zod';
import { imageFileSchema } from '~/schemas/file';

export const photoCollectionBaseSchema = z.object({
  _type: z.literal('photoCollection'),
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  thumbnail: imageFileSchema,
});

export type PhotoCollectionBase = z.infer<typeof photoCollectionBaseSchema>;

export const photoCollectionSchema = photoCollectionBaseSchema.extend({
  photos: imageFileSchema.array(),
});

export type PhotoCollection = z.infer<typeof photoCollectionSchema>;

export const photoCategorySchema = z.object({
  _type: z.literal('photoCategory'),
  _id: z.string(),
  title: z.string(),
  collections: photoCollectionBaseSchema.array(),
});

export type PhotoCategory = z.infer<typeof photoCategorySchema>;
