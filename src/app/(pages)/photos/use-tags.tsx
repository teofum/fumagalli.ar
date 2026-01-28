import z from 'zod';

import { TAGS_QUERY } from '@/queries/queries';
import { sanityClient } from '@/utils/sanity.server';

export async function fetchTags() {
  return z
    .string()
    .array()
    .parse(await sanityClient.fetch(TAGS_QUERY))
    .reduce(
      (tagGroups, tag) => {
        const [groupName, name] = tag.split(':');

        const group = tagGroups[groupName] ?? [];
        return {
          ...tagGroups,
          [groupName]: [...group, name],
        };
      },
      {} as { [key: string]: string[] },
    );
}
