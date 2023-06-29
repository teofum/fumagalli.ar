import useSystemStore from '~/stores/system';
import { themes } from './types';
import Button from '~/components/ui/Button';

export default function ThemeSettings() {
  const { theme, updateTheme } = useSystemStore();

  return (
    <div className="flex flex-col gap-1">
      <div className="grid place-items-center w-80 h-60 bevel-content">
        TODO: Preview
      </div>

      {themes.map((t) => (
        <Button
          key={t.cssClass}
          disabled={t.cssClass === theme.cssClass}
          onClick={() => updateTheme(t)}
        >
          <span>{t.name}</span>
        </Button>
      ))}
    </div>
  );
}
