import Button from '../ui/Button';
import Menu from '../ui/Menu';
import useDesktopStore from '@/stores/desktop';
import useSystemStore from '@/stores/system';
import useFileHandler from '@/hooks/use-file-handler';

import { about } from '../apps/About';
import { intro } from '../apps/Intro';
import { minesweeper } from '../apps/Minesweeper';
import { files } from '../apps/Files';
import { sudoku } from '../apps/Sudoku';
import { solitaire } from '../apps/Solitaire';
import { themeSettings } from '../apps/ThemeSettings';
import { dosEmu } from '../apps/DOSEmu';
import { ditherLab } from '../apps/DitherLab';
import { DOS_GAMES } from '../apps/DOSEmu/types';
import { help } from '../apps/Help';
import { paint } from '../apps/Paint';
import { systemSettings } from '../apps/SystemSettings';

const ICON_PATH = '/fs/System Files/Icons/Start';

export default function StartMenu() {
  const { launch, openShutdown: shutdown } = useDesktopStore();
  const { fileHistory } = useSystemStore();

  const fileHandler = useFileHandler();

  return (
    <Menu.Bar>
      <Menu.Menu
        trigger={
          <Button className="py-1 px-2 bold data-[state=open]:bevel-inset w-16">
            Start
          </Button>
        }
        contentProps={{ side: 'top' }}
      >
        <div className="flex flex-row">
          <div className="w-8 flex flex-row py-2 pl-1 pr-0 bevel-light-inset overflow-hidden">
            <h1 className="[writing-mode:vertical-rl] rotate-180 self-end font-display text-4xl text-inset">
              <span className="mr-1">Te</span>
              <span className="tracking-[2px]">OS</span>
            </h1>
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
                      icon={`/fs/Applications/dos/icon_16.png`}
                      onSelect={() => launch(dosEmu(game))}
                    />
                  ))}
                </Menu.Sub>
                {[minesweeper, solitaire, sudoku].map((app) => (
                  <Menu.Item
                    key={app.appType}
                    label={app.title ?? ''}
                    icon={`/fs/Applications/${app.appType}/icon_16.png`}
                    onSelect={() => launch(app)}
                  />
                ))}
              </Menu.Sub>
              {[
                files({ folderId: '949f9fc6-19d4-479a-a1ec-c4a80cffb3a6' }),
                paint,
                ditherLab(),
                about,
                intro,
              ].map((app) => (
                <Menu.Item
                  key={app.appType}
                  label={app.title ?? ''}
                  icon={`/fs/Applications/${app.appType}/icon_16.png`}
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
                icon="/fs/System Files/Icons/FileType/folder_16.png"
                onSelect={() =>
                  launch(
                    files({ folderId: '679b7214-24c9-439e-86bc-cd86cc215dc3' }),
                  )
                }
              />
              <Menu.Item
                label="Photos"
                icon="/fs/System Files/Icons/FileType/folder_16.png"
                onSelect={() =>
                  launch(
                    files({ folderId: '49fba51f-c8ee-450d-bc21-522066ceb7ea' }),
                  )
                }
              />
              <Menu.Item
                label="Projects"
                icon="/fs/System Files/Icons/FileType/folder_16.png"
                onSelect={() =>
                  launch(
                    files({ folderId: '2d282fb9-580f-47c1-a419-1db426c6a2c9' }),
                  )
                }
              />
            </Menu.Sub>

            <Menu.Sub
              className="gap-2 w-44"
              label="Documents"
              icon={`${ICON_PATH}/documents.png`}
            >
              <Menu.Item
                label="My Documents"
                icon="/fs/Applications/files/icon_16.png"
                onSelect={() =>
                  launch(
                    files({ folderId: '949f9fc6-19d4-479a-a1ec-c4a80cffb3a6' }),
                  )
                }
              />

              <Menu.Separator />

              {fileHistory.map(({ time, item }) => (
                <Menu.Item
                  key={`${time}_${item.name}`}
                  label={item.name}
                  icon={`/fs/System Files/Icons/FileType/${item._type}_16.png`}
                  onSelect={() => fileHandler.open(item)}
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
              {[themeSettings, systemSettings].map((app) => (
                <Menu.Item
                  key={app.appType}
                  label={app.title ?? ''}
                  icon={`/fs/Applications/${app.appType}/icon_16.png`}
                  onSelect={() => launch(app)}
                />
              ))}
            </Menu.Sub>

            <Menu.Item
              className="gap-2 w-44"
              label="Help"
              icon={`${ICON_PATH}/help.png`}
              onSelect={() => launch(help())}
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
      </Menu.Menu>
    </Menu.Bar>
  );
}
