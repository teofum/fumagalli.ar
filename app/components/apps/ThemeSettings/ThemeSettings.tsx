import useSystemStore from '~/stores/system';
import { themes } from './types';
import { Select, SelectItem } from '~/components/ui/Select';

export default function ThemeSettings() {
  const { theme, updateTheme } = useSystemStore();

  const selectTheme = (value: string) => {
    const newTheme = themes.find((t) => t.cssClass === value);
    if (newTheme) updateTheme(newTheme);
  };

  return (
    <div className="flex flex-col gap-1.5 p-1">
      <div className="grid place-items-center w-80 h-60 bevel-content">
        TODO: Preview
      </div>

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
    </div>
  );
}
