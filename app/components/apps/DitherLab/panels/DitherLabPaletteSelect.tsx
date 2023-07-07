import { useMemo } from 'react';

import { useAppState } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Collapsible from '~/components/ui/Collapsible';
import { Select, SelectItem } from '~/components/ui/Select';

import PalettePreview from '../components/PalettePreview';
import palettes from '~/dither/palettes';
import { PaletteGroup } from '~/dither/palettes/types';
import { useSyncedAppSettings } from '~/stores/system';

interface DitherLabPaletteSelectProps {
  openEditor: () => void;
}

export default function DitherLabPaletteSelect({
  openEditor,
}: DitherLabPaletteSelectProps) {
  const [state, setState] = useAppState('dither');
  const [settings] = useSyncedAppSettings('dither');

  const allPalettes = useMemo(
    () => [...palettes, ...settings.customPalettes],
    [settings.customPalettes],
  );

  const groupOptions = useMemo(
    () =>
      Object.values(PaletteGroup)
        .filter((val) => !val.startsWith('__'))
        .filter((val) => allPalettes.filter((p) => p.group === val).length > 0),
    [allPalettes],
  );

  const paletteOptions = useMemo(
    () =>
      allPalettes
        .filter((pal) => pal.group === state.paletteGroup)
        .map((pal) => pal.name),
    [state.paletteGroup, allPalettes],
  );

  const selectGroup = (group: string) => {
    const palette = allPalettes.find((pal) => pal.group === group);
    if (palette) setState({ paletteGroup: group as PaletteGroup, palette });
  };

  const selectPalette = (name: string) => {
    const palette = allPalettes.find((pal) => pal.name === name);
    if (palette) setState({ palette });
  };

  return (
    <Collapsible defaultOpen title="Color Palette">
      <div className="flex flex-col gap-2">
        <Select value={state.paletteGroup} onValueChange={selectGroup}>
          {groupOptions.map((group) => (
            <SelectItem key={group} value={group}>
              {group}
            </SelectItem>
          ))}
        </Select>

        <Select value={state.palette.name} onValueChange={selectPalette}>
          {paletteOptions.map((palette) => (
            <SelectItem key={palette} value={palette}>
              {palette}
            </SelectItem>
          ))}
        </Select>

        <PalettePreview />

        <Button className="py-1 px-2" onClick={openEditor}>
          Palette Editor
        </Button>
      </div>
    </Collapsible>
  );
}
