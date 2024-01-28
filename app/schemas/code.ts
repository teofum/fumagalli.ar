import { z } from 'zod';

const codeSchema = z.any();
// const codeSchema = z.object({
//   _type: z.literal('code'),
// });

export default codeSchema;

export type Image = z.infer<typeof codeSchema>;
