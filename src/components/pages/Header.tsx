'use client';

import Link from 'next/link';
import { LinkButton } from '../ui/Button';
import { usePathname } from 'next/navigation';

interface BreadcrumbProps {
  route: { name: string; path: string };
}

function Breadcrumb({ route }: BreadcrumbProps) {
  return (
    <>
      <Link href={route.path}>{route.name}</Link>
      <span>/</span>
    </>
  );
}

export default function Header() {
  const pathname = usePathname();

  const fragments = pathname.split('/');
  const routes = fragments.map((fragment, i) => ({
    name: fragment || 'home',
    path: `${fragments.slice(0, i + 1).join('/')}` || '/home',
  }));

  return (
    <header className="px-4 py-2">
      <nav className="max-w-3xl mx-auto flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          {routes.slice(0, -1).map((route) => (
            <Breadcrumb key={route.path} route={route} />
          ))}
        </div>

        <LinkButton href="/" className="px-2 py-1 min-w-20 text-base font-sans">
          <div className="flex flex-row items-center gap-2">
            <img
              src="/fs/System Files/Icons/shutdown.png"
              width={32}
              height={32}
              className="[image-rendering:pixelated]"
              alt=""
            />
            <span>Boot TeOS</span>
          </div>
        </LinkButton>
      </nav>
    </header>
  );
}
