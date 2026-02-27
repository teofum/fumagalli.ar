import type { WindowInit } from '@/components/desktop/Window';
import { WindowSizingMode } from '@/components/desktop/Window/WindowSizingMode';
import { useWindow } from '@/components/desktop/Window/context';
import Button from '@/components/ui/Button';
import { ToggleButton, ToggleGroup } from '@/components/ui/ToggleGroup';
import { getAppResourcesUrl } from '@/content/utils';
import { useSyncedAppSettings } from '@/hooks/use-app-settings';

const resources = getAppResourcesUrl('solitaire');

export default function SolitaireDeckSelect() {
  const { close } = useWindow();
  const [settings, set] = useSyncedAppSettings('solitaire');

  return (
    <div className="flex flex-col gap-4 p-2">
      <ToggleGroup
        type="single"
        className="grid grid-cols-6 gap-1"
        value={settings.back.toString()}
        onValueChange={(value) => set({ back: Number(value) })}
      >
        {Array.from(Array(12), (_, i) => i).map((i) => (
          <ToggleButton key={i} value={i.toString()} className="px-0.5!">
            <img src={`${resources}/back${i}.png`} alt={`Card back ${i + 1}`} />
          </ToggleButton>
        ))}
      </ToggleGroup>
      <Button onClick={close} className="self-end py-1 px-2 w-20">
        Done
      </Button>
    </div>
  );
}

export const solitaire_deck: WindowInit<'solitaire_deck'> = {
  appType: 'solitaire_deck',
  appState: undefined,

  title: 'Select Card Back',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
