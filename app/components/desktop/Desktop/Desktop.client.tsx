import { useEffect } from 'react';
import Window from '../Window';
import Taskbar from '../Taskbar';
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
import ContextMenu from '~/components/ui/ContextMenu';
import { themeSettings } from '~/components/apps/ThemeSettings';
import ShutdownDialog from './ShutdownDialog';
import MobileDialog from './MobileDialog';

let initialized = false;

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
            WebkitMaskImage: `url('${iconUrl}')`,
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
  const { theme, themeCustomizations } = useSystemStore();
  const { windows, launch } = useDesktopStore();

  const { backgroundColor, backgroundUrl, backgroundImageMode } =
    themeCustomizations;

  /**
   * We want to apply themes to the html element rather than the desktop because
   * Radix UI elements (menus, popovers etc) are portaled out of it.
   * However, we don't want to add classes to the desktop on routes other than
   * index, as those routes are server-rendered and that would result in theme
   * flashing
   */
  useEffect(() => {
    document.documentElement.className = theme.cssClass;
  }, [theme.cssClass]);

  /**
   * Init effect: open info windows on startup if no windows are open
   */
  useEffect(() => {
    if (initialized) return;

    if (windows.length === 0) {
      const desktopEl = document.querySelector('#desktop') as HTMLDivElement;
      const desktop = desktopEl.getBoundingClientRect();

      launch({ ...about, top: 50, left: 50 });
      launch({
        ...intro,
        top: desktop.height / 2 - 300,
        left: desktop.width / 2 - 320,
      });
    }

    initialized = true;
  }, [launch, windows.length]);

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
          <ContextMenu.Root
            content={
              <ContextMenu.Item
                label="System Theme..."
                icon="/fs/Applications/theme/icon_16.png"
                onSelect={() => launch(themeSettings)}
              />
            }
          >
            <div className="w-full h-full grid grid-cols-[repeat(auto-fill,4rem)] auto-cols-[4rem] auto-rows-[4.5rem] content-start gap-2 p-2">
              <DesktopIcon
                iconUrl="/fs/System Files/Icons/computer.png"
                title="My Computer"
                open={() => launch(files({ path: '/' }))}
              />
              <DesktopIcon
                iconUrl="/fs/System Files/Icons/documents.png"
                title="My Documents"
                open={() => launch(files({ path: '/Documents' }))}
              />
              <DesktopIcon
                iconUrl="/fs/Applications/intro/icon_32.png"
                title="About me"
                open={() => launch(intro)}
              />
              <DesktopIcon
                iconUrl="/fs/Applications/dither/icon_32.png"
                title="DitherLab 2"
                y={2}
                open={() => launch(ditherLab())}
              />
              <DesktopIcon
                iconUrl="/fs/Applications/paint/icon_32.png"
                title="Paint"
                y={2}
                open={() => launch(paint)}
              />
              <DesktopIcon
                iconUrl="/fs/Applications/mine/icon_32.png"
                title="Minesweeper"
                y={3}
                open={() => launch(minesweeper)}
              />
              <DesktopIcon
                iconUrl="/fs/Applications/sudoku/icon_32.png"
                title="Sudoku"
                y={3}
                open={() => launch(sudoku)}
              />
              <DesktopIcon
                iconUrl="/fs/Applications/solitaire/icon_32.png"
                title="Solitaire"
                y={3}
                open={() => launch(solitaire)}
              />
              {DOS_GAMES.map((game) => (
                <DesktopIcon
                  key={game.title}
                  title={game.title}
                  iconUrl="/fs/Applications/dos/icon_32.png"
                  y={3}
                  open={() => launch(dosEmu(game))}
                />
              ))}
            </div>
          </ContextMenu.Root>

          {windows.map((window) => (
            <Window key={window.id} {...window} />
          ))}
        </div>
        <Taskbar />
      </div>

      <ShutdownDialog />
      <MobileDialog />
    </>
  );
}
