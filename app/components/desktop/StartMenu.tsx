import { useDesktop } from './Desktop/context';
import Button from '../ui/Button';
import Menu from '../ui/Menu';
import { about } from '../apps/About';
import { intro } from '../apps/Intro';
import { minesweeper } from '../apps/Minesweeper';

export default function StartMenu() {
  const { launch } = useDesktop();

  return (
    <Menu.Root
      trigger={
        <Button className="py-1 px-2 bold data-[state=open]:bevel-inset w-16">
          Start
        </Button>
      }
      contentProps={{ side: 'top' }}
    >
      {[about, intro, minesweeper].map((app) => (
        <Menu.Item
          key={app.appType}
          label={app.title ?? ''}
          icon={`/fs/system/Applications/${app.appType}/icon_16.png`}
          onSelect={() => launch(app)}
        />
      ))}
    </Menu.Root>
  );
}
