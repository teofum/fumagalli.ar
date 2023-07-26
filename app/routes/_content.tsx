import { Outlet } from '@remix-run/react';
import Header from '~/components/pages/Header';

export default function ContentRoute() {
  return (
    <div className="min-h-full font-text text-content-base">
      <Header />
      <Outlet />
    </div>
  );
}
