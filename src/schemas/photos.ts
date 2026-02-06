import { z } from 'zod';

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

export const exifMetadataSchema = z
  .object({
    DateTimeOriginal: z.string().optional(),
    LensModel: z.string().optional(),

    FocalLength: z.number().optional(),
    FNumber: z.number().optional(),
    ExposureTime: z.number().optional(),
    ISO: z.number().optional(),
    ExposureBiasValue: z.number().optional(),

    ExposureProgram: z.number().optional(),
  })
  .transform((rawExif) => ({
    dateTime: rawExif.DateTimeOriginal
      ? new Date(rawExif.DateTimeOriginal)
      : undefined,
    lens: rawExif.LensModel,

    focalLength: rawExif.FocalLength,
    aperture: rawExif.FNumber,
    shutterSpeed: rawExif.ExposureTime,
    iso: rawExif.ISO,
    exposureBias: rawExif.ExposureBiasValue,

    mode: EXIF_EXPOSURE_PROGRAMS[rawExif.ExposureProgram ?? 0],
  }));

export type EXIF = z.infer<typeof exifMetadataSchema>;

const photoMetadataSchema = z.object({
  dimensions: z.object({
    height: z.number(),
    width: z.number(),
    aspectRatio: z.number(),
  }),
  exif: exifMetadataSchema,
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

export const photoCollectionBaseSchema = z.object({
  _type: z.literal('photoCollection'),
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  thumbnail: photoSchema,
});

export type PhotoCollectionBase = z.infer<typeof photoCollectionBaseSchema>;

export const photoCollectionSchema = photoCollectionBaseSchema.extend({
  type: z.enum(['photos', 'filters']),
  photos: photoSchema.array().optional(),
});

export type PhotoCollection = z.infer<typeof photoCollectionSchema>;

export const photoCategorySchema = z.object({
  _type: z.literal('photoCategory'),
  _id: z.string(),
  title: z.string(),
  collections: photoCollectionBaseSchema.array(),
});

export type PhotoCategory = z.infer<typeof photoCategorySchema>;
