import { useEffect, useState } from 'react';
import Window from '../Window';
import Taskbar from '../Taskbar';
import Dialog, { DialogClose } from '~/components/ui/Dialog';
import Button from '~/components/ui/Button';
import useDesktopStore from '~/stores/desktop';
import { about } from '~/components/apps/About';
import { intro } from '~/components/apps/Intro';

export default function Desktop() {
  const { windows, launch, shutdownDialog, shutdown } = useDesktopStore();
  const [isShutdown, setShutdown] = useState(false);

  useEffect(() => {
    if (windows.length === 0) {
      launch(about);
      launch(intro);
    }
  // This is only meant to run once on startup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-screen h-screen flex flex-col">
        <div id="desktop" className="relative flex-1 bg-desktop">
          {windows.map((window) => (
            <Window key={window.id} {...window} />
          ))}
        </div>
        <Taskbar />
      </div>

      <Dialog title="Shut Down" open={shutdownDialog} onOpenChange={shutdown}>
        <div className="flex flex-col gap-4 px-3 py-2">
          <div className="flex flex-row gap-4">
            <img src="/fs/system/Resources/Icons/shutdown.png" alt="" />
            <div>Are you sure you want to shut down the system?</div>
          </div>

          <div className="flex flex-row justify-end gap-2">
            <Button
              className="w-20 p-1 outline outline-1 outline-black"
              onClick={() => setShutdown(true)}
            >
              OK
            </Button>

            <DialogClose asChild>
              <Button className="w-20 p-1">Cancel</Button>
            </DialogClose>
          </div>
        </div>
      </Dialog>

      {isShutdown ? (
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
