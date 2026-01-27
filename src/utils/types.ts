export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type ServerComponentProps = {
  searchParams: Promise<SearchParams>;
};
