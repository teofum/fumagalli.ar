import useSystemStore from '~/stores/system';
import { themes } from './types';
import { Select, SelectItem } from '~/components/ui/Select';
import ThemePreview from './ThemePreview';
import { useWindow } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Divider from '~/components/ui/Divider';
import ColorPicker from '~/components/ui/ColorPicker';

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
          className="flex-1"
          value={themeCustomizations.backgroundColor}
          onValueChange={(value) =>
            updateThemeCustomizations({ backgroundColor: value })
          }
        />

        <Button
          className="px-2 py-1 w-16"
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
