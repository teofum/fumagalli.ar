import { fetch, json, type LoaderArgs } from '@remix-run/node';
import type { useLoaderData } from '@remix-run/react';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const difficulty = url.searchParams.get('difficulty') ?? 'medium';

  // Yes, this loads an entire 300KB JSON file each time. Yes, it's dumb. It's
  // also fast enough that I don't need to bother with a database.
  const res = await fetch(
    `${url.origin}/fs/Applications/sudoku/resources/sudoku_${difficulty}.json`,
  );
  const data = (await res.json()) as { name: string; data: number[] }[];

  const i = Math.floor(Math.random() * data.length);
  const sudoku = data[i];

  return json({ data: sudoku.data, difficulty, number: i + 1 });
}

export type SudokuPuzzle = ReturnType<typeof useLoaderData<typeof loader>>;
