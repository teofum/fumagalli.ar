'use client';

import { useEffect } from 'react';

import useDesktopStore from '@/stores/desktop';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const { close, windows } = useDesktopStore();

  const mac = navigator.platform.startsWith('Mac');
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const mac = navigator.platform.startsWith('Mac');
      const ctrl = mac ? ev.metaKey : ev.ctrlKey;
      const alt = ev.altKey;
      const del = ev.key === 'Backspace' || ev.key === 'Delete';

      if (ctrl && alt && del) {
        // Close all windows, then restart
        windows.map(({ id }) => id).forEach((id) => close(id));
      }

      if (!['Control', 'Alt', 'Meta', 'Shift'].includes(ev.key))
        location.reload();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close, windows]);

  return (
    <div
      className="
        w-screen h-screen bg-[#000080] text-white
        flex flex-col items-center justify-center font-bsod text-xl leading-4
      "
    >
      <div className="bg-white text-[#000080]">&nbsp;System error&nbsp;</div>
      <div className="max-w-[60ch]">
        <br />
        <p>An error has ocurred. To continue:</p>
        <p>Press Enter to restart the system in its current state, or</p>
        <p>
          Press {mac ? 'CMD+OPT' : 'CTRL+ALT'}+DEL to reset the system. All open
          windows will be closed and any unsaved work will be lost.
        </p>
        <br />
        <p>Error: {errorMessage}</p>
      </div>

      <div>
        <br />
        <p>Press any key to continue</p>
      </div>
    </div>
  );
}
