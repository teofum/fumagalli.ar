import useSystemStore from '~/stores/system';
import { themes } from './types';
import { Select, SelectItem } from '~/components/ui/Select';
import ThemePreview from './ThemePreview';
import { useWindow } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Divider from '~/components/ui/Divider';
import ColorPicker from '~/components/ui/ColorPicker';
import parseCSSColor from 'parse-css-color';
import { useState } from 'react';

export default function ThemeSettings() {
  const { theme, updateTheme, themeCustomizations, updateThemeCustomizations } =
    useSystemStore();
  const { close } = useWindow();

  const [bg, setBg] = useState<number[] | undefined>(() => {
    const bg = themeCustomizations.backgroundColor;
    if (!bg) return;

    return parseCSSColor(bg)?.values;
  });

  const selectTheme = (value: string) => {
    const newTheme = themes.find((t) => t.cssClass === value);
    if (newTheme) updateTheme(newTheme);
  };

  const updateBackground = (value?: number[]) => {
    setBg(value);

    if (value) {
      const [r, g, b] = value;
      updateThemeCustomizations({ backgroundColor: `rgb(${r} ${g} ${b})` });
    } else updateThemeCustomizations({ backgroundColor: undefined });
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
          value={bg}
          onValueCommit={updateBackground}
        />

        <Button
          className="px-2 py-1 w-16"
          disabled={!themeCustomizations.backgroundColor}
          onClick={() => updateBackground(undefined)}
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
