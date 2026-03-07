import useSystemStore from "@/stores/system";
import { Select, SelectItem } from "@/components/ui/Select";
import { useWindow } from "@/components/desktop/Window/context";
import Button from "@/components/ui/Button";
import GroupBox from "@/components/ui/GroupBox";
import type { SystemSettings } from "./types";
import { RadioButton, RadioGroup } from "@/components/ui/Radio";
import Slider from "@/components/ui/Slider";

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
          <span className="w-24">Taskbar location</span>
          <RadioGroup
            className="flex-1"
            orientation="horizontal"
            value={settings.taskbarPosition}
            onValueChange={(value) => update({ taskbarPosition: value as any })}
          >
            <RadioButton value="top" id="settings_taskbar_top">
              Top
            </RadioButton>
            <RadioButton value="bottom" id="settings_taskbar_bottom">
              Bottom
            </RadioButton>
          </RadioGroup>
        </div>
      </GroupBox>

      <GroupBox title="Images">
        <div className="flex flex-row items-center gap-2 mb-2">
          <span className="w-24">Quality</span>
          <Slider
            className="grow"
            defaultValue={settings.imageQuality}
            onValueChange={(value) => update({ imageQuality: value })}
            min={20}
            max={100}
            step={10}
          />
          <span className="w-8 text-end">{settings.imageQuality}</span>
        </div>

        <div className="flex flex-row items-center gap-2">
          <span className="w-24">Max Size</span>
          <Select
            triggerProps={{ className: "flex-1" }}
            value={settings.imageSize.toString()}
            onValueChange={(value) => update({ imageSize: Number(value) })}
          >
            <SelectItem value="500">Tiny (500px)</SelectItem>
            <SelectItem value="1000">Small (1000px)</SelectItem>
            <SelectItem value="2000">Normal (2000px)</SelectItem>
            <SelectItem value="4000">Large (4000px)</SelectItem>
            <SelectItem value="100000">Original size (SLOW)</SelectItem>
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
