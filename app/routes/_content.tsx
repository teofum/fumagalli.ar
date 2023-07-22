import { Outlet } from '@remix-run/react';

export default function ContentRoute() {
  return (
    <div className="min-h-full p-8">
      <Outlet />
    </div>
  );
}
