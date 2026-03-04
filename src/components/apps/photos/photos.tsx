import Menu from '@/components/ui/Menu';
import CollectionsPanel from './panels/collections-panel';
import PhotosPanel from './panels/photos-panel';
import { useAppSettings } from '@/hooks/use-app-settings';

export default function Photos() {
  const [settings, set] = useAppSettings('photos');

  return (
    <div className="flex flex-col gap-0.5">
      <Menu.Bar>
        <Menu.Menu trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.Sub label="Mode">
            <Menu.RadioGroup
              value={settings.viewMode}
              onValueChange={(val) =>
                set({ viewMode: val as typeof settings.viewMode })
              }
            >
              <Menu.RadioItem label="Grid" value="grid" />
              <Menu.RadioItem label="Loupe" value="loupe" />
              <Menu.RadioItem label="Details" value="details" />
            </Menu.RadioGroup>
          </Menu.Sub>
        </Menu.Menu>
      </Menu.Bar>

      <div className="flex flex-row items-stretch gap-0.5 grow min-h-0">
        <CollectionsPanel />
        <PhotosPanel />
        <div className="bevel-inset p-0.5">
          <div className="bevel bg-surface p-1">hello</div>
        </div>
      </div>
    </div>
  );
}
