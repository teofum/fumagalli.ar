import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'y9lopbef',
  dataset: 'production',
  useCdn: true,
  apiVersion: 'v2022-03-07',
});
