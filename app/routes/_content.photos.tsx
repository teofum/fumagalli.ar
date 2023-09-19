import { Outlet } from '@remix-run/react';

export default function PostsRoute() {
  return (
    <main className="p-4">
      <Outlet />
    </main>
  );
}
