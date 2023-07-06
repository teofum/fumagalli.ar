import cn from 'classnames';
import { useMemo } from 'react';
import { useAppState } from '~/components/desktop/Window/context';
import Collapsible from '~/components/ui/Collapsible';
import { Select, SelectItem } from '~/components/ui/Select';
import palettes from '~/dither/palettes';
import { PaletteGroup } from '~/dither/palettes/types';
import getPaletteColors from '~/dither/utils/paletteColors';

const PG_OPTIONS = Object.values(PaletteGroup)
  .filter((val) => !val.startsWith('__'))
  .filter((val) => palettes.filter((p) => p.group === val).length > 0);

function PalettePreview() {
  const [state] = useAppState('dither');

  const colors = useMemo(
    () => getPaletteColors(state.palette),
    [state.palette],
  );

  return (
    <div className="flex flex-row flex-wrap">
      {colors.map(([r, g, b], i) => (
        <div
          key={i}
          className={cn('bevel-content', {
            'w-6 h-6': colors.length <= 32,
            'w-4 h-4': colors.length > 32 && colors.length <= 72,
            'w-3 h-3': colors.length > 72,
          })}
          style={{ backgroundColor: `rgb(${r} ${g} ${b})` }}
        />
      ))}
    </div>
  );
}

export default function DitherLabPaletteSelect() {
  const [state, setState] = useAppState('dither');

  const paletteOptions = useMemo(
    () =>
      palettes
        .filter((pal) => pal.group === state.paletteGroup)
        .map((pal) => pal.name),
    [state.paletteGroup],
  );

  const selectGroup = (group: string) => {
    const palette = palettes.find((pal) => pal.group === group);
    if (palette) setState({ paletteGroup: group as PaletteGroup, palette });
  };

  const selectPalette = (name: string) => {
    const palette = palettes.find((pal) => pal.name === name);
    if (palette) setState({ palette });
  };

  return (
    <Collapsible defaultOpen title="Color Palette">
      <div className="flex flex-col gap-2">
        <Select value={state.paletteGroup} onValueChange={selectGroup}>
          {PG_OPTIONS.map((group) => (
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
      </div>
    </Collapsible>
  );
}
