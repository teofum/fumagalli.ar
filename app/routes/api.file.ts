import { json, type LoaderArgs } from '@remix-run/node';
import type { useLoaderData } from '@remix-run/react';
import fileSchema from '~/schemas/file';
import { sanityClient } from '~/utils/sanity.server';

const fileQuery = (id: string) => `
*[_type != "folder" && _id == "${id}"][0] {
  ...,
}`;

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const fileId = url.searchParams.get('id') ?? '';

  const data = await fileSchema
    .promise()
    .parse(sanityClient.fetch(fileQuery(fileId)));

  return json(data);
}

export type SudokuPuzzle = ReturnType<typeof useLoaderData<typeof loader>>;
