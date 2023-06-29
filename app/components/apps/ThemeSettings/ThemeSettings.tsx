import useSystemStore from '~/stores/system';
import { themes } from './types';
import { Select, SelectItem } from '~/components/ui/Select';
import ThemePreview from './ThemePreview';
import { useWindow } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';

export default function ThemeSettings() {
  const { theme, updateTheme } = useSystemStore();
  const { close } = useWindow();

  const selectTheme = (value: string) => {
    const newTheme = themes.find((t) => t.cssClass === value);
    if (newTheme) updateTheme(newTheme);
  };

  return (
    <div className="flex flex-col gap-1.5 p-1">
      <ThemePreview />

      <div className="flex flex-row items-baseline gap-2">
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

      <Button className="px-2 py-1 w-20 text-center self-end" onClick={close}>
        <span>Done</span>
      </Button>
    </div>
  );
}
