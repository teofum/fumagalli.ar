import { useAppState } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import ScrollContainer from '~/components/ui/ScrollContainer';
import Close from '~/components/ui/icons/Close';

import PalettePreview from '../components/PalettePreview';
import {
  type Palette,
  PaletteGroup,
  PaletteType,
} from '~/dither/palettes/types';
import getPaletteColors, { getPaletteSize } from '~/dither/utils/paletteColors';
import Divider from '~/components/ui/Divider';
import { useSyncedAppSettings } from '~/stores/system';
import Win4bRGBI from '~/dither/palettes/Win4bRGBI';
import Input from '~/components/ui/Input';
import { useEffect, useState } from 'react';
import ColorPicker from '~/components/ui/ColorPicker';

interface PaletteInfoProps {
  duplicate: () => void;
}

function PaletteInfo({ duplicate }: PaletteInfoProps) {
  const [state] = useAppState('dither');

  return (
    <div className="flex flex-col gap-2">
      <div className="bold">{state.palette.name}</div>

      <div className="flex flex-row gap-1 items-center">
        <div className="w-12">Group</div>
        <div className="input grow">{state.palette.group}</div>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <div className="w-12">Type</div>
        <div className="input grow">{state.palette.type}</div>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <div className="w-12">Colors</div>
        <div className="input grow">{getPaletteSize(state.palette)} colors</div>
      </div>

      <PalettePreview />

      <Divider />

      <p>
        Preset palettes cannot be edited. To edit this palette, create a copy
        first.
      </p>

      <Button className="py-1 px-2 w-full" onClick={duplicate}>
        Copy as custom palette
      </Button>
    </div>
  );
}

function PaletteEditor() {
  const [state, setState] = useAppState('dither');
  const [settings, set] = useSyncedAppSettings('dither');

  const [openPicker, setOpenPicker] = useState<number | null>(null);
  const [name, setName] = useState(state.palette.name);
  useEffect(() => setName(state.palette.name), [state.palette.name]);

  const update = (newPalette: Partial<Palette>) => {
    const paletteName = newPalette.name ?? state.palette.name;

    // Update settings
    set({
      customPalettes: settings.customPalettes.map((pal) =>
        pal.name === state.palette.name ? { ...pal, ...newPalette } : pal,
      ),
    });

    // Update state
    setState({
      palette: { ...state.palette, ...newPalette },
      paletteName,
    });
  };

  const nameTaken = settings.customPalettes.some((pal) => pal.name === name);
  const commitName = () => {
    if (nameTaken) return;
    update({ name });
  };

  const updateColor = (index: number, color: number[]) => {
    const data = state.palette.data.slice();
    for (let i = 0; i < 3; i++) data[index * 3 + i] = color[i];

    update({ data });
  };

  const removeColor = (index: number) => {
    const data = state.palette.data.slice();
    data.splice(index * 3, 3);

    update({ data });
  };

  const addColor = () => {
    update({ data: [...state.palette.data, 0, 0, 0] });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row bevel-content p-0.5">
        <Input
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          className="py-0.5 px-1.5 shadow-none flex-1 min-w-0 overflow-hidden text-ellipsis"
        />
        <Button
          className="py-0.5 px-2 w-12"
          onClick={commitName}
          disabled={nameTaken}
        >
          <span>Save</span>
        </Button>
      </div>

      <div>
        {state.palette.type},{' '}
        <span className="bold">{getPaletteSize(state.palette)}</span> colors
      </div>

      {getPaletteColors(state.palette).map(([r, g, b], i) => (
        <div key={`${r}-${g}-${b}_${i}`} className="flex flex-row gap-1">
          <ColorPicker
            className="grow"
            value={[r, g, b]}
            onValueCommit={(value) => updateColor(i, value)}
            open={openPicker === i}
            onOpenChange={(open) => setOpenPicker(open ? i : null)}
          />
          <Button
            variant="light"
            className="p-1"
            onClick={() => removeColor(i)}
          >
            <img src="/fs/System Files/UI/remove.png" alt="Remove" />
          </Button>
        </div>
      ))}

      <Button className="py-1 px-2 w-full" onClick={addColor}>
        Add color
      </Button>
    </div>
  );
}

interface DitherLabPaletteEditorProps {
  close: () => void;
}

export default function DitherLabPaletteEditor({
  close,
}: DitherLabPaletteEditorProps) {
  const [state, setState] = useAppState('dither');
  const [settings, set] = useSyncedAppSettings('dither');

  const isCustom = state.palette.group === PaletteGroup.User;

  const create = () => {
    let n = 1;

    for (
      let i = 1;
      settings.customPalettes.some(({ name }) => name === `New palette #${i}`);

    ) {
      n = ++i;
    }

    const newPalette: Palette = {
      name: `New palette #${n}`,
      type: PaletteType.Indexed,
      group: PaletteGroup.User,
      data: [0, 0, 0, 255, 255, 255],
    };

    set({ customPalettes: [...settings.customPalettes, newPalette] });
    setState({ paletteGroup: PaletteGroup.User, palette: newPalette });
  };

  const duplicate = () => {
    const src = state.palette;
    let n = 0;

    for (
      let i = 0;
      settings.customPalettes.some(
        ({ name }) => name === `${src.name} copy${i ? ` ${i}` : ''}`,
      );

    ) {
      n = ++i;
    }

    const newPalette: Palette = {
      name: `${src.name} copy${n ? ` ${n}` : ''}`,
      type: PaletteType.Indexed,
      group: PaletteGroup.User,
      data: getPaletteColors(src).flat(),
    };

    set({ customPalettes: [...settings.customPalettes, newPalette] });
    setState({ paletteGroup: PaletteGroup.User, palette: newPalette });
  };

  const deletePalette = () => {
    if (!isCustom) return;

    set({
      customPalettes: settings.customPalettes.filter(
        (pal) => pal.name !== state.palette.name,
      ),
    });
    setState({
      paletteGroup: PaletteGroup.RetroPC,
      palette: Win4bRGBI,
      paletteName: Win4bRGBI.name,
    });
  };

  return (
    <ScrollContainer
      hide="x"
      className="bg-surface w-[14.5rem] min-w-[14.5rem]"
    >
      <div className="bg-surface bevel sticky top-0">
        <div className="py-0.5 pl-2 pr-1 w-full flex flex-row items-center gap-2">
          <span>Palette Editor</span>
          <div className="grow h-1.5 border-t border-b border-light" />
          <Button variant="light" onClick={close}>
            <Close />
          </Button>
        </div>

        <div className="p-3 flex flex-row">
          <Button className="py-1 px-2 flex-1" onClick={create}>
            <span>New</span>
          </Button>
          <Button className="py-1 px-2 flex-1" onClick={duplicate}>
            <span>Duplicate</span>
          </Button>
          <Button
            className="py-1 px-2 flex-1"
            onClick={deletePalette}
            disabled={!isCustom}
          >
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="bg-surface bevel p-3">
        {isCustom ? <PaletteEditor /> : <PaletteInfo duplicate={duplicate} />}
      </div>
    </ScrollContainer>
  );
}
