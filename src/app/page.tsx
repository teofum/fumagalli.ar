'use client';

import Desktop from '@/components/desktop/Desktop';
import { useEffect, useState } from 'react';

export default function DesktopPage() {
  // Prevents this route from rendering on the server
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return mounted ? <Desktop /> : null;
}
