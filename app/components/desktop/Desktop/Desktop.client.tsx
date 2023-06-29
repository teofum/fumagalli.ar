import { useEffect, useState } from 'react';
import Window from '../Window';
import Taskbar from '../Taskbar';
import Dialog, { DialogClose } from '~/components/ui/Dialog';
import Button from '~/components/ui/Button';
import useDesktopStore from '~/stores/desktop';
import { about } from '~/components/apps/About';
import { intro } from '~/components/apps/Intro';
import cn from 'classnames';
import useSystemStore from '~/stores/system';

type ComputerState = 'on' | 'off' | 'shutting-down';

export default function Desktop() {
  const { themeCustomizations } = useSystemStore();
  const { windows, launch, close, shutdownDialog, openShutdown } =
    useDesktopStore();
  const [computerState, setComputerState] = useState<ComputerState>('on');

  useEffect(() => {
    const desktopEl = document.querySelector('#desktop') as HTMLDivElement;
    const desktop = desktopEl.getBoundingClientRect();

    if (windows.length === 0) {
      launch({ ...about, top: 50, left: 50 });
      launch({
        ...intro,
        top: desktop.height / 2 - 300,
        left: desktop.width / 2 - 320,
      });
    }
    // This is only meant to run once on startup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shutdown = () => {
    setComputerState('shutting-down');

    windows.forEach(({ id }, i) => setTimeout(() => close(id), i * 150));
    setTimeout(() => {
      setComputerState('off');
      openShutdown(false);
    }, windows.length * 150);
  };

  return (
    <>
      <div className={cn('w-screen h-screen flex flex-col overflow-hidden')}>
        <div
          id="desktop"
          className="relative flex-1 bg-desktop"
          style={{ backgroundColor: themeCustomizations.backgroundColor }}
        >
          {windows.map((window) => (
            <Window key={window.id} {...window} />
          ))}
        </div>
        <Taskbar />
      </div>

      <Dialog
        title="Shut Down"
        open={shutdownDialog}
        onOpenChange={openShutdown}
      >
        <div className="flex flex-col gap-4 px-3 py-2">
          <div className="flex flex-row gap-4">
            <img src="/fs/system/Resources/Icons/shutdown.png" alt="" />
            <div>
              {computerState === 'on'
                ? 'Are you sure you want to shut down the system?'
                : 'Shutting down...'}
            </div>
          </div>

          <div className="flex flex-row justify-end gap-2">
            <Button
              className="w-20 p-1 outline outline-1 outline-black"
              onClick={shutdown}
              disabled={computerState !== 'on'}
            >
              <span>OK</span>
            </Button>

            <DialogClose asChild>
              <Button className="w-20 p-1" disabled={computerState !== 'on'}>
                <span>Cancel</span>
              </Button>
            </DialogClose>
          </div>
        </div>
      </Dialog>

      {computerState === 'off' ? (
        <div className="fixed inset-0 z-6000 bg-black flex flex-row items-center justify-center">
          <img
            src="/fs/system/Resources/shutdown.png"
            alt="It's now safe to turn off your computer."
            className="w-full"
          />
        </div>
      ) : null}
    </>
  );
}
