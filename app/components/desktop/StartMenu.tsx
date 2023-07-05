import { version } from 'package.json';

import Button from '../ui/Button';
import Menu from '../ui/Menu';
import useDesktopStore from '~/stores/desktop';
import useSystemStore from '~/stores/system';
import useFileHandler from '~/hooks/useFileHandler';

import { about } from '../apps/About';
import { intro } from '../apps/Intro';
import { minesweeper } from '../apps/Minesweeper';
import { files } from '../apps/Files';
import { sudoku } from '../apps/Sudoku';
import { solitaire } from '../apps/Solitaire';
import { themeSettings } from '../apps/ThemeSettings';
import { dosEmu } from '../apps/DOSEmu';
import { DOS_GAMES } from '../apps/DOSEmu/types';

const ICON_PATH = '/fs/system/Resources/Icons/Start';

export default function StartMenu() {
  const { launch, openShutdown: shutdown } = useDesktopStore();
  const { fileHistory } = useSystemStore();

  const fileHandler = useFileHandler();

  return (
    <Menu.Root
      trigger={
        <Button className="py-1 px-2 bold data-[state=open]:bevel-inset w-16">
          Start
        </Button>
      }
      contentProps={{ side: 'top' }}
    >
      <div className="flex flex-row">
        <div className="bg-selection text-selection w-6 flex flex-row p-2">
          <span className="[writing-mode:vertical-rl] rotate-180 self-end bold">
            TeOS {version}
          </span>
        </div>
        <div>
          <Menu.Sub
            className="gap-2 w-44"
            label="Applications"
            icon={`${ICON_PATH}/applications.png`}
          >
            <Menu.Sub label="Games">
              <Menu.Sub label="DOS">
                {DOS_GAMES.map((game) => (
                  <Menu.Item
                    key={game.title}
                    label={game.title}
                    icon={`/fs/system/Applications/dos/icon_16.png`}
                    onSelect={() => launch(dosEmu(game))}
                  />
                ))}
              </Menu.Sub>
              {[minesweeper, solitaire, sudoku].map((app) => (
                <Menu.Item
                  key={app.appType}
                  label={app.title ?? ''}
                  icon={`/fs/system/Applications/${app.appType}/icon_16.png`}
                  onSelect={() => launch(app)}
                />
              ))}
            </Menu.Sub>
            {[files({ path: '/Documents' }), about, intro].map((app) => (
              <Menu.Item
                key={app.appType}
                label={app.title ?? ''}
                icon={`/fs/system/Applications/${app.appType}/icon_16.png`}
                onSelect={() => launch(app)}
              />
            ))}
          </Menu.Sub>

          <Menu.Sub
            className="gap-2 w-44"
            label="Favorites"
            icon={`${ICON_PATH}/favorites.png`}
          >
            <Menu.Item
              label="Articles"
              icon="/fs/system/Resources/Icons/FileType/dir_16.png"
              onSelect={() => launch(files({ path: '/Documents/Articles' }))}
            />
            <Menu.Item
              label="Photos"
              icon="/fs/system/Resources/Icons/FileType/dir_16.png"
              onSelect={() => launch(files({ path: '/Documents/Photos' }))}
            />
            <Menu.Item
              label="Projects"
              icon="/fs/system/Resources/Icons/FileType/dir_16.png"
              onSelect={() => launch(files({ path: '/Documents/Projects' }))}
            />
          </Menu.Sub>

          <Menu.Sub
            className="gap-2 w-44"
            label="Documents"
            icon={`${ICON_PATH}/documents.png`}
          >
            <Menu.Item
              label="My Documents"
              icon="/fs/system/Applications/files/icon_16.png"
              onSelect={() => launch(files({ path: '/Documents' }))}
            />

            <Menu.Separator />

            {fileHistory.map(({ time, item, path }) => (
              <Menu.Item
                key={`${time}_${item.name}`}
                label={item.name}
                icon={`/fs/system/Resources/Icons/FileType/${item.type}_16.png`}
                onSelect={() => fileHandler.open(item, path)}
              />
            ))}

            {fileHistory.length === 0 ? (
              <Menu.Item label="[EMPTY]" disabled />
            ) : null}
          </Menu.Sub>

          <Menu.Sub
            className="gap-2 w-44"
            label="Settings"
            icon={`${ICON_PATH}/settings.png`}
          >
            {[themeSettings].map((app) => (
              <Menu.Item
                key={app.appType}
                label={app.title ?? ''}
                icon={`/fs/system/Applications/${app.appType}/icon_16.png`}
                onSelect={() => launch(app)}
              />
            ))}
          </Menu.Sub>

          <Menu.Item
            className="gap-2 w-44"
            label="Help"
            icon={`${ICON_PATH}/help.png`}
          />

          <Menu.Separator />

          <Menu.Item
            className="gap-2 w-44"
            label="Shut down..."
            icon={`${ICON_PATH}/shutdown.png`}
            onSelect={() => shutdown()}
          />
        </div>
      </div>
    </Menu.Root>
  );
}
