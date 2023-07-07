import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Slider from '@radix-ui/react-slider';
import cn from 'classnames';

import Button from './Button';
import { ToggleButton, ToggleGroup } from './ToggleGroup';

const PRESET_COLORS = [
  [0xff, 0xff, 0xff],
  [0x00, 0x00, 0x00],
  [0xc0, 0xc0, 0xc0],
  [0x80, 0x80, 0x80],
  [0xff, 0x00, 0x00],
  [0x80, 0x00, 0x00],
  [0xff, 0xff, 0x00],
  [0x80, 0x80, 0x00],
  [0x00, 0xff, 0x00],
  [0x00, 0x80, 0x00],
  [0x00, 0xff, 0xff],
  [0x00, 0x80, 0x80],
  [0x00, 0x00, 0xff],
  [0x00, 0x00, 0x80],
  [0xff, 0x00, 0xff],
  [0x80, 0x00, 0x80],
];

type ColorSliderProps = {
  value: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  trackProps?: React.ComponentProps<typeof Slider.Track>;
  thumbProps?: React.ComponentProps<typeof Slider.Thumb>;
} & Omit<
  React.ComponentProps<typeof Slider.Root>,
  'value' | 'onValueChange' | 'onValueCommit'
>;

function ColorSlider({
  value,
  onValueChange,
  onValueCommit,
  className,
  trackProps,
  thumbProps,
  ...props
}: ColorSliderProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Slider.Root
        className={cn(
          'grow relative flex items-center touch-none h-6',
          className,
        )}
        value={[value]}
        onValueChange={(value) => onValueChange?.(value[0])}
        onValueCommit={(value) => onValueCommit?.(value[0])}
        {...props}
      >
        <Slider.Track
          {...trackProps}
          className={cn(
            'bevel-light-inset h-1.5 w-full',
            trackProps?.className,
          )}
        />
        <Slider.Thumb
          {...thumbProps}
          className={cn(
            'absolute w-2.5 h-5 bg-surface bevel -translate-x-1/2 -translate-y-1/2',
            thumbProps?.className,
          )}
        />
      </Slider.Root>
      <span className="w-6 text-right">{value}</span>
    </div>
  );
}

interface ColorPickerProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  className?: string;
}

export default function ColorPicker({
  value,
  onValueChange,
  onValueCommit,
  open,
  onOpenChange,
  className,
}: ColorPickerProps) {
  const defaultMode =
    !value ||
    PRESET_COLORS.some(
      ([r, g, b]) => r === value[0] && g === value[1] && b === value[2],
    )
      ? 'presets'
      : 'custom';

  const [_open, _setOpen] = useState(false);
  const isOpen = open ?? _open;
  const setOpen = (open: boolean) =>
    onOpenChange ? onOpenChange(open) : _setOpen(open);

  const [mode, setMode] = useState<'presets' | 'custom'>(defaultMode);

  const [r, setR] = useState(value?.[0] ?? 0);
  const [g, setG] = useState(value?.[1] ?? 0);
  const [b, setB] = useState(value?.[2] ?? 0);

  const change = ([r, g, b]: number[]) => {
    setR(r);
    setG(g);
    setB(b);

    onValueChange?.([r, g, b]);
  };
  const commit = ([r, g, b]: number[]) => {
    setR(r);
    setG(g);
    setB(b);

    onValueChange?.([r, g, b]);
    onValueCommit?.([r, g, b]);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button className={cn('p-1', { 'bevel-inset': open }, className)}>
          {value ? (
            <div
              className="min-w-12 w-full h-4 bevel-light-inset"
              style={{
                backgroundColor: `rgb(${value[0]} ${value[1]} ${value[2]})`,
              }}
            />
          ) : (
            <div>No color selected</div>
          )}
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-surface bevel-window p-2 z-2000 flex flex-col w-52 gap-1 select-none"
          align="start"
        >
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => setMode(value as any)}
          >
            <ToggleButton value="presets" className="flex-1">
              <span>Presets</span>
            </ToggleButton>
            <ToggleButton value="custom" className="flex-1">
              <span>Custom</span>
            </ToggleButton>
          </ToggleGroup>

          {mode === 'presets' ? (
            <div className="grid grid-rows-2 self-start grid-flow-col">
              {PRESET_COLORS.map(([r, g, b]) => (
                <button
                  className="button bevel-content w-6 h-6"
                  style={{ backgroundColor: `rgb(${r} ${g} ${b})` }}
                  key={`${r}-${g}-${b}`}
                  onClick={() => {
                    commit([r, g, b]);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div
                className="w-full h-6 bevel-content"
                style={{ backgroundColor: `rgb(${r} ${g} ${b})` }}
              />

              <ColorSlider
                value={r}
                onValueChange={(value) => change([value, g, b])}
                onValueCommit={(value) => commit([value, g, b])}
                max={255}
                trackProps={{
                  style: {
                    background: `linear-gradient(to right, rgb(0 ${g} ${b}), rgb(255 ${g} ${b}))`,
                  },
                }}
              />
              <ColorSlider
                value={g}
                onValueChange={(value) => change([r, value, b])}
                onValueCommit={(value) => commit([r, value, b])}
                max={255}
                trackProps={{
                  style: {
                    background: `linear-gradient(to right, rgb(${r} 0 ${b}), rgb(${r} 255 ${b}))`,
                  },
                }}
              />
              <ColorSlider
                value={b}
                onValueChange={(value) => change([r, g, value])}
                onValueCommit={(value) => commit([r, g, value])}
                max={255}
                trackProps={{
                  style: {
                    background: `linear-gradient(to right, rgb(${r} ${g} 0), rgb(${r} ${g} 255))`,
                  },
                }}
              />
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
