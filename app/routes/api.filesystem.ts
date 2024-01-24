import { json, type LoaderArgs } from '@remix-run/node';
import type { useLoaderData } from '@remix-run/react';
import folderSchema from '~/schemas/folder';
import { sanityClient } from '~/utils/sanity.server';

const folderQuery = (id: string = 'root') => `
*[_type == "folder" && _id == "${id}"][0] {
  ...,
  "parent": *[_type == "folder" && references(^._id)][0] {
    ...,
    "parent": *[_type == "folder" && references(^._id)][0] {
      ...,
      "parent": *[_type == "folder" && references(^._id)][0],
    },
  },
  items[]->
}`;

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const folderId = url.searchParams.get('id') ?? 'root';

  const raw = await sanityClient.fetch(folderQuery(folderId));
  const data = folderSchema.parse({ ...raw, items: raw.items ?? [] });

  return json(data);
}

export type SudokuPuzzle = ReturnType<typeof useLoaderData<typeof loader>>;
