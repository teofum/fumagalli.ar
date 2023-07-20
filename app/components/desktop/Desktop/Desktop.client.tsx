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
import parseCSSColor from 'parse-css-color';
import { files } from '~/components/apps/Files';
import { minesweeper } from '~/components/apps/Minesweeper';
import { sudoku } from '~/components/apps/Sudoku';
import { solitaire } from '~/components/apps/Solitaire';
import { dosEmu } from '~/components/apps/DOSEmu';
import { ditherLab } from '~/components/apps/DitherLab';
import { DOS_GAMES } from '~/components/apps/DOSEmu/types';
import { paint } from '~/components/apps/Paint';

type ComputerState = 'on' | 'off' | 'shutting-down';

interface DesktopIconProps {
  iconUrl: string;
  title: string;
  x?: number;
  y?: number;
  open: () => void;
}

function DesktopIcon({ iconUrl, title, x, y, open }: DesktopIconProps) {
  const desktopEl = document.querySelector('#desktop') as HTMLDivElement;
  const desktopColor = desktopEl
    ? getComputedStyle(desktopEl).backgroundColor
    : 'black';

  const parsed = parseCSSColor(desktopColor);
  const [r, g, b] = parsed?.values ?? [0, 0, 0];
  const luma = (r * 299 + g * 587 + b * 114) / (255.0 * 1000);
  const contrastColor = luma > 0.5 ? 'black' : 'white';

  return (
    <button
      className="flex flex-col gap-1 w-16 items-center cursor-default group outline-none"
      onDoubleClick={() => open()}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter') open();
      }}
      style={{ gridColumn: x, gridRow: y }}
    >
      <span className="relative">
        <img src={iconUrl} alt="" />
        <span
          className={cn(
            'absolute inset-0 bg-selection bg-opacity-50',
            'hidden group-focus:inline',
          )}
          style={{
            WebkitMaskImage: `url(${iconUrl})`,
          }}
        />
      </span>
      <div className="max-h-8">
        <div
          className={cn(
            'px-0.5 text-ellipsis',
            'group-focus:!bg-selection group-focus:!text-selection',
            'line-clamp-2 group-focus:line-clamp-none',
          )}
          style={{ backgroundColor: desktopColor, color: contrastColor }}
        >
          {title}
        </div>
      </div>
    </button>
  );
}

export default function Desktop() {
  const { themeCustomizations } = useSystemStore();
  const { windows, launch, close, shutdownDialog, openShutdown } =
    useDesktopStore();
  const [computerState, setComputerState] = useState<ComputerState>('on');

  const { backgroundColor, backgroundUrl, backgroundImageMode } =
    themeCustomizations;

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
          className="relative flex-1 bg-desktop [image-rendering:pixelated]"
          style={{
            backgroundColor: backgroundColor,
            backgroundImage: `url('${backgroundUrl}')`,
            backgroundRepeat:
              backgroundImageMode === 'tile' ? 'repeat' : 'no-repeat',
            backgroundPosition:
              backgroundImageMode === 'tile' ? 'top left' : 'center center',
            backgroundSize:
              backgroundImageMode === 'fill'
                ? 'cover'
                : backgroundImageMode === 'stretch'
                ? '100% 100%'
                : 'auto auto',
          }}
        >
          <div className="w-full h-full grid grid-cols-[repeat(auto-fill,4rem)] auto-cols-[4rem] auto-rows-[4.5rem] content-start gap-2 p-2">
            <DesktopIcon
              iconUrl="/fs/system/Resources/Icons/computer.png"
              title="My Computer"
              open={() => launch(files({ path: '/' }))}
            />
            <DesktopIcon
              iconUrl="/fs/system/Resources/Icons/documents.png"
              title="My Documents"
              open={() => launch(files({ path: '/Documents' }))}
            />
            <DesktopIcon
              iconUrl="/fs/system/Applications/intro/icon_32.png"
              title="About me"
              open={() => launch(intro)}
            />
            <DesktopIcon
              iconUrl="/fs/system/Applications/dither/icon_32.png"
              title="DitherLab 2"
              y={2}
              open={() => launch(ditherLab())}
            />
            <DesktopIcon
              iconUrl="/fs/system/Applications/paint/icon_32.png"
              title="Paint"
              y={2}
              open={() => launch(paint)}
            />
            <DesktopIcon
              iconUrl="/fs/system/Applications/mine/icon_32.png"
              title="Minesweeper"
              y={3}
              open={() => launch(minesweeper)}
            />
            <DesktopIcon
              iconUrl="/fs/system/Applications/sudoku/icon_32.png"
              title="Sudoku"
              y={3}
              open={() => launch(sudoku)}
            />
            <DesktopIcon
              iconUrl="/fs/system/Applications/solitaire/icon_32.png"
              title="Solitaire"
              y={3}
              open={() => launch(solitaire)}
            />
            {DOS_GAMES.map((game) => (
              <DesktopIcon
                key={game.title}
                title={game.title}
                iconUrl="/fs/system/Applications/dos/icon_32.png"
                y={3}
                open={() => launch(dosEmu(game))}
              />
            ))}
          </div>

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
