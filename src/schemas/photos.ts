import { z } from 'zod';
import { imageFileSchema } from '@/schemas/file';

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

const EXIF_EXPOSURE_PROGRAMS = [
  'unknown',
  'manual',
  'program',
  'aperture-priority',
  'shutterspeed-priority',
  'creative',
  'action',
  'portrait',
  'landscape',
  'bulb',
] as const;

const photoMetadataSchema = z.object({
  dimensions: z.object({
    height: z.number(),
    width: z.number(),
    aspectRatio: z.number(),
  }),
  exif: z
    .object({
      DateTimeOriginal: z.string(),
      LensModel: z.string(),

      FocalLength: z.number(),
      FNumber: z.number(),
      ExposureTime: z.number(),
      ISO: z.number(),
      ExposureBiasValue: z.number(),

      ExposureProgram: z.number(),
    })
    .transform((rawExif) => ({
      dateTime: new Date(rawExif.DateTimeOriginal),
      lens: rawExif.LensModel,

      focalLength: rawExif.FocalLength,
      aperture: rawExif.FNumber,
      shutterSpeed: rawExif.ExposureTime,
      iso: rawExif.ISO,
      exposureBias: rawExif.ExposureBiasValue,

      mode: EXIF_EXPOSURE_PROGRAMS[rawExif.ExposureProgram],
    })),
  lqip: z.string(),
});

export const photoSchema = z.object({
  _type: z.literal('sanity.imageAsset'),
  _id: z.string(),

  mimeType: z.string(),
  originalFilename: z.string(),
  size: z.number(),

  assetId: z.string(),
  path: z.string(),

  metadata: photoMetadataSchema,
  tags: z.string().array(),
});

export type Photo = z.infer<typeof photoSchema>;
