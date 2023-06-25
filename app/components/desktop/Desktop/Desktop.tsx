import { useReducer, useState } from 'react';
import Window from '../Window';
import desktopReducer, { createWindow } from './reducer';
import { DesktopProvider } from './context';
import { about } from '~/components/apps/About';
import { intro } from '~/components/apps/Intro';
import Taskbar from '../Taskbar';
import Dialog, { DialogClose } from '~/components/ui/Dialog';
import Button from '~/components/ui/Button';

export default function Desktop() {
  const [isShutdown, setShutdown] = useState(false);
  const [sdOpen, setSdOpen] = useState(false);

  const [state, dispatch] = useReducer(desktopReducer, {
    windows: [
      { ...createWindow(about), order: 0, focused: false },
      { ...createWindow(intro), order: 1, focused: true },
    ],
  });

  const shutdown = () => setShutdown(true);

  return (
    <DesktopProvider
      state={state}
      dispatch={dispatch}
      shutdown={() => setSdOpen(true)}
    >
      <div className="w-screen h-screen bg-desktop flex flex-col">
        <div className="relative flex-1">
          {state.windows.map((window) => (
            <Window key={window.id} {...window} />
          ))}
        </div>
        <Taskbar />
      </div>

      <Dialog title="Shut Down" open={sdOpen} onOpenChange={setSdOpen}>
        <div className="flex flex-col gap-4 px-3 py-2">
          <div className="flex flex-row gap-4">
            <img src="/fs/system/Resources/Icons/shutdown.png" alt="" />
            <div>Are you sure you want to shut down the system?</div>
          </div>

          <div className="flex flex-row justify-end gap-2">
            <Button
              className="w-20 p-1 outline outline-1 outline-black"
              onClick={shutdown}
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
    </DesktopProvider>
  );
}
