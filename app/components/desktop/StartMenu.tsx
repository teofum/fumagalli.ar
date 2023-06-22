import { useDesktop } from './Desktop/context';
import Button from '../ui/Button';
import Menu from '../ui/Menu';
import { about } from '../apps/About';
import { intro } from '../apps/Intro';

export default function StartMenu() {
  const { launch } = useDesktop();

  return (
    <Menu.Root
      trigger={
        <Button className="py-1 px-2 bold data-[state=open]:bevel-inset">
          Start
        </Button>
      }
      contentProps={{ side: 'top' }}
    >
      {[about, intro].map((app) => (
        <Menu.Item
          key={app.appType}
          label={app.title ?? ''}
          icon={app.icon}
          onSelect={() => launch(app)}
        />
      ))}
    </Menu.Root>
  );
}
