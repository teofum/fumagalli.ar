import { Params } from 'next/dist/server/request/params';

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type ServerComponentProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<Params>;
};
