import useSystemStore from '~/stores/system';
import { themes } from './types';
import { Select, SelectItem } from '~/components/ui/Select';
import ThemePreview from './ThemePreview';
import { useWindow } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Divider from '~/components/ui/Divider';

const PRESET_COLORS = [
  '#ffffff',
  '#000000',
  '#c0c0c0',
  '#808080',
  '#ff0000',
  '#800000',
  '#ffff00',
  '#808000',
  '#00ff00',
  '#008000',
  '#00ffff',
  '#008080',
  '#0000ff',
  '#000080',
  '#ff00ff',
  '#800080',
];

function ColorPicker({
  value,
  onValueChange,
}: React.ComponentProps<typeof Select>) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      triggerProps={{ className: 'flex-1' }}
      contentProps={{ className: 'bg-surface bevel w-auto border-0' }}
      viewportClassName="grid grid-cols-4 gap-0.5 p-1"
      renderValue={
        value ? (
          <div
            className="w-full h-full border border-black"
            style={{ backgroundColor: value }}
          />
        ) : (
          '[Theme default]'
        )
      }
      placeholder="[Theme default]"
    >
      {PRESET_COLORS.map((color) => (
        <SelectItem
          key={color}
          value={color}
          className="w-4 h-4 bevel-content"
          style={{ backgroundColor: color }}
        />
      ))}
    </Select>
  );
}

export default function ThemeSettings() {
  const { theme, updateTheme, themeCustomizations, updateThemeCustomizations } =
    useSystemStore();
  const { close } = useWindow();

  const selectTheme = (value: string) => {
    const newTheme = themes.find((t) => t.cssClass === value);
    if (newTheme) updateTheme(newTheme);
  };

  return (
    <div className="flex flex-col gap-1.5 p-1">
      <ThemePreview />

      <div className="flex flex-row items-center gap-2">
        <span className="w-20">Color scheme</span>

        <Select
          value={theme.cssClass}
          onValueChange={selectTheme}
          triggerProps={{ className: 'flex-1' }}
        >
          {themes.map((t) => (
            <SelectItem key={t.cssClass} value={t.cssClass}>
              {t.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Divider />

      <div className="flex flex-row items-center gap-2">
        <span className="w-20">Background</span>

        <ColorPicker
          value={themeCustomizations.backgroundColor}
          onValueChange={(value) =>
            updateThemeCustomizations({ backgroundColor: value })
          }
        />

        <Button
          className="px-2 py-1 w-1/3"
          disabled={!themeCustomizations.backgroundColor}
          onClick={() =>
            updateThemeCustomizations({ backgroundColor: undefined })
          }
        >
          <span>Reset</span>
        </Button>
      </div>

      <Button
        className="px-2 py-1 mt-2 w-16 text-center self-end"
        onClick={close}
      >
        <span>Done</span>
      </Button>
    </div>
  );
}
