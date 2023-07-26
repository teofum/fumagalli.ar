import { Outlet } from '@remix-run/react';

export default function ProjectsRoute() {
  return (
    <main className="p-4">
      <Outlet />
    </main>
  );
}
