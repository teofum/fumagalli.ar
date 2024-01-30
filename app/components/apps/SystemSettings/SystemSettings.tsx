import useSystemStore from '~/stores/system';
import { Select, SelectItem } from '~/components/ui/Select';
import { useWindow } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import GroupBox from '~/components/ui/GroupBox';
import type { SystemSettings } from './types';

export default function ThemeSettings() {
  const { settings, updateSettings } = useSystemStore();
  const { close } = useWindow();

  const update = (newSettings: Partial<SystemSettings>) => {
    updateSettings({ ...settings, ...newSettings });
  };

  return (
    <div className="flex flex-col gap-1.5 p-2 min-w-96">
      <GroupBox title="Desktop">
        <div className="flex flex-row items-center gap-2">
          <span className="w-32">Taskbar location</span>
          <Select
            triggerProps={{ className: 'flex-1' }}
            value={settings.taskbarPosition}
            onValueChange={(value) => update({ taskbarPosition: value as any })}
          >
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
          </Select>
        </div>
      </GroupBox>

      <Button
        className="px-2 py-1 mt-2 w-16 text-center self-end"
        onClick={close}
      >
        <span>Done</span>
      </Button>
    </div>
  );
}
