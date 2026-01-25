import { useMemo } from 'react';

import { useAppState } from '@/components/desktop/Window/context';
import Button from '@/components/ui/Button';
import Collapsible from '@/components/ui/Collapsible';
import { Select, SelectItem } from '@/components/ui/Select';

import PalettePreview from '../components/PalettePreview';
import palettes from '@/dither/palettes';
import { PaletteGroup } from '@/dither/palettes/types';
import { useSyncedAppSettings } from '@/stores/system';
import cn from 'classnames';
import ArrowLeft from '@/components/ui/icons/ArrowLeft';

const PAGE_SIZE = 8;

interface DitherLabPaletteSelectProps {
  openEditor: () => void;
  importPalettes: () => void;
}

export default function DitherLabPaletteSelect({
  openEditor,
  importPalettes,
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
        .filter(
          (val) => allPalettes.find((p) => p.group === val) !== undefined,
        ),
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
    if (palette) {
      setState({
        paletteGroup: group as PaletteGroup,
        paletteName: palette.name,
        paletteSelectOffset: 0,
      });
    }
  };

  const selectPalette = (name: string) => {
    setState({ paletteName: name });
  };

  const setOffset = (offset: number) => {
    setState({ paletteSelectOffset: offset });
  };

  const offset = state.paletteSelectOffset;
  const count = paletteOptions.length;
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

        <div
          className={cn('bg-default bevel-content p-0.5 flex flex-col', {
            'min-h-38': count > PAGE_SIZE,
          })}
        >
          {paletteOptions.slice(offset, offset + PAGE_SIZE).map((palette) => (
            <button
              key={palette}
              onClick={() => selectPalette(palette)}
              className={cn('flex px-1 cursor-default', {
                'bg-selection text-selection': palette === state.paletteName,
              })}
            >
              {palette}
            </button>
          ))}
          {count > PAGE_SIZE ? (
            <div className="flex flex-row mt-auto">
              <Button
                className="px-1"
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                <ArrowLeft className="rotate-180" />
              </Button>
              <div className="text-center grow bevel bg-surface p-0.5">
                {offset + 1} - {Math.min(offset + PAGE_SIZE, count)} of {count}
              </div>
              <Button
                className="px-1"
                onClick={() => {
                  if (offset + PAGE_SIZE < count) setOffset(offset + PAGE_SIZE);
                }}
              >
                <ArrowLeft />
              </Button>
            </div>
          ) : null}
        </div>

        <PalettePreview />

        <div className="flex flex-row">
          <Button className="py-1 px-2 flex-1" onClick={openEditor}>
            Palette Editor
          </Button>
          <Button className="py-1 px-2 flex-1" onClick={importPalettes}>
            Import...
          </Button>
        </div>
      </div>
    </Collapsible>
  );
}
