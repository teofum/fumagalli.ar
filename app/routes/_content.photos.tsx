import { Outlet } from '@remix-run/react';

export default function PhotosRoute() {
  return (
    <main className="p-4">
      <Outlet />
    </main>
  );
}
