import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import type { DosPlayer as Instance, DosPlayerFactoryType } from 'js-dos';

declare const Dos: DosPlayerFactoryType;

interface PlayerProps {
  dos: Instance | null;
  setDos: Dispatch<SetStateAction<Instance | null>>;
  bundleUrl: string;
}

export default function DosPlayer({ dos, setDos, bundleUrl }: PlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef === null || rootRef.current === null) {
      return;
    }

    const root = rootRef.current as HTMLDivElement;
    root.textContent = ''; // Clear
    const instance = Dos(root, {
      style: 'none',
      noSideBar: true,
      noFullscreen: true,
      noSocialLinks: true,
      clickToStart: false,
    });

    setDos(instance);

    return () => {
      instance.stop();
    };
  }, [rootRef, setDos]);

  useEffect(() => {
    if (dos !== null) {
      dos.run(bundleUrl); // ci is returned
    }
  }, [dos, bundleUrl]);

  return <div ref={rootRef} style={{ width: '100%', height: '100%' }}></div>;
}
