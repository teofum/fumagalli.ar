import { useDesktop } from './Desktop/context';
import Button from '../ui/Button';
import Menu from '../ui/Menu';
import { about } from '../apps/About';
import { intro } from '../apps/Intro';
import { minesweeper } from '../apps/Minesweeper';

const ICON_PATH = '/fs/system/Resources/Icons/Start';

export default function StartMenu() {
  const { launch, shutdown } = useDesktop();

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
            TeOS 0.1.0
          </span>
        </div>
        <div>
          <Menu.Sub
            className="gap-2 w-44"
            label="Applications"
            icon={`${ICON_PATH}/applications.png`}
          >
            <Menu.Sub label="Games">
              {[minesweeper].map((app) => (
                <Menu.Item
                  key={app.appType}
                  label={app.title ?? ''}
                  icon={`/fs/system/Applications/${app.appType}/icon_16.png`}
                  onSelect={() => launch(app)}
                />
              ))}
            </Menu.Sub>
            {[about, intro].map((app) => (
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
            label="Documents"
            icon={`${ICON_PATH}/documents.png`}
          >
            <Menu.Item label="[EMPTY]" disabled />
          </Menu.Sub>
          <Menu.Sub
            className="gap-2 w-44"
            label="Settings"
            icon={`${ICON_PATH}/settings.png`}
          >
            <Menu.Item label="[EMPTY]" disabled />
          </Menu.Sub>
          <Menu.Item
            className="gap-2 w-44"
            label="Help"
            icon={`${ICON_PATH}/help.png`}
          />
          <Menu.Item
            className="gap-2 w-44"
            label="Shut down..."
            icon={`${ICON_PATH}/shutdown.png`}
            onSelect={shutdown}
          />
        </div>
      </div>
    </Menu.Root>
  );
}
