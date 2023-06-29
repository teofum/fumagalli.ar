import type { V2_MetaFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';
import Desktop from '~/components/desktop/Desktop';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Teo Fumagalli' },
    { name: 'description', content: 'Welcome to my site!' },
  ];
};

export default function Index() {
  // Prevents this route from rendering on the server
  // https://github.com/remix-run/remix/discussions/1023
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return mounted ? <Desktop /> : null;
}

export function ErrorBoundary() {
  return (
    <div className="my-6 mx-auto w-full max-w-lg border border-[red] p-4">
      A system error ocurred... The most likely cause is stale data from an
      older version of this app. Please delete all site data and refresh the
      page.
    </div>
  );
}
