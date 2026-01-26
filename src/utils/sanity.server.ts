import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'y9lopbef',
  dataset: 'production',
  useCdn: true,
  apiVersion: 'v2025-03-10',
});
