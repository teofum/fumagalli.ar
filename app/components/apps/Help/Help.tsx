import Menu from '~/components/ui/Menu';
import HelpContent from './HelpContent';
import HelpTreeView from './HelpTreeView';
import { useWindow } from '~/components/desktop/Window/context';

export default function Help() {
  const { close } = useWindow();

  return (
    <div className="flex flex-col gap-0.5">
      <Menu.Bar>
        <Menu.Menu trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.CheckboxItem label="Show Contents" />
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>Go</Menu.Trigger>}>
          <Menu.Item label="Back" onSelect={close} />
          <Menu.Item label="Forward" onSelect={close} />
          <Menu.Item label="Home" onSelect={close} />
        </Menu.Menu>
      </Menu.Bar>

      <div className="flex-1 flex flex-row gap-0.5 min-h-0">
        <div className="w-48 min-w-48 flex flex-col">
          <HelpTreeView />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <HelpContent />
        </div>
      </div>
    </div>
  );
}
