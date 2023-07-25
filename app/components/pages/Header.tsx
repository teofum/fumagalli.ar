import { Link, useLocation } from '@remix-run/react';
import { LinkButton } from '../ui/Button';

interface BreadcrumbProps {
  route: { name: string; path: string };
}

function Breadcrumb({ route }: BreadcrumbProps) {
  return (
    <>
      <Link to={route.path}>{route.name}</Link>
      <span>/</span>
    </>
  );
}

export default function Header() {
  const location = useLocation();

  const fragments = location.pathname.split('/');
  const routes = fragments.map((fragment, i) => ({
    name: fragment || 'home',
    path: `${fragments.slice(0, i + 1).join('/')}` || '/about',
  }));

  return (
    <header className="px-4 py-2">
      <nav className="max-w-3xl mx-auto flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          {routes.slice(0, -1).map((route) => (
            <Breadcrumb key={route.path} route={route} />
          ))}
        </div>

        <LinkButton to="/" className="px-2 py-1 min-w-20 text-base font-sans">
          <div className="flex flex-row items-center gap-2">
            <img src="/fs/system/Resources/Icons/shutdown.png" alt="" />
            <span>Boot TeOS</span>
          </div>
        </LinkButton>
      </nav>
    </header>
  );
}
