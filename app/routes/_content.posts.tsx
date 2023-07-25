import { Outlet } from '@remix-run/react';

export default function PostsRoute() {
  return (
    <article className="p-4 article font-text text-content-base">
      <Outlet />
    </article>
  );
}
