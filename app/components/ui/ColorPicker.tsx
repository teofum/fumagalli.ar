import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Slider from '@radix-ui/react-slider';
import cn from 'classnames';
import parse from 'parse-css-color';

import Button from './Button';
import { ToggleButton, ToggleGroup } from './ToggleGroup';

const PRESET_COLORS = [
  '#ffffff',
  '#000000',
  '#c0c0c0',
  '#808080',
  '#ff0000',
  '#800000',
  '#ffff00',
  '#808000',
  '#00ff00',
  '#008000',
  '#00ffff',
  '#008080',
  '#0000ff',
  '#000080',
  '#ff00ff',
  '#800080',
];

type ColorSliderProps = {
  value: number;
  onValueChange?: (value: number) => void;
  trackProps?: React.ComponentProps<typeof Slider.Track>;
  thumbProps?: React.ComponentProps<typeof Slider.Thumb>;
} & Omit<React.ComponentProps<typeof Slider.Root>, 'value' | 'onValueChange'>;

function ColorSlider({
  value,
  onValueChange,
  className,
  trackProps,
  thumbProps,
  ...props
}: ColorSliderProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="w-6 text-right">{value}</span>
      <Slider.Root
        className={cn(
          'grow relative flex items-center touch-none h-6',
          className,
        )}
        value={[value]}
        onValueChange={(value) => onValueChange?.(value[0])}
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
            'absolute w-2 h-6 bg-surface bevel -translate-x-1/2 -translate-y-1/2',
            thumbProps?.className,
          )}
        />
      </Slider.Root>
    </div>
  );
}

interface ColorPickerProps {
  value?: string;
  onValueChange?: (value: string) => void;

  className?: string;
}

export default function ColorPicker({
  value,
  onValueChange,
  className,
}: ColorPickerProps) {
  const defaultMode = !value || PRESET_COLORS.includes(value)
    ? 'presets'
    : 'custom';

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'presets' | 'custom'>(defaultMode);

  const color = parse(value ?? '#000');
  const [r, setR] = useState(color?.values[0] ?? 0);
  const [g, setG] = useState(color?.values[1] ?? 0);
  const [b, setB] = useState(color?.values[2] ?? 0);

  const commitCustomValue = () => {
    onValueChange?.(`rgb(${r}, ${g}, ${b})`);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button className={cn('p-1', { 'bevel-inset': open }, className)}>
          {value ? (
            <div
              className="min-w-12 w-full h-4 border border-black"
              style={{ backgroundColor: value }}
            />
          ) : (
            'No color selected'
          )}
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-surface bevel-window p-1 z-2000 flex flex-col gap-1 w-[150px] select-none"
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
            <div className="grid grid-rows-2 gap-0.5 self-start grid-flow-col">
              {PRESET_COLORS.map((color) => (
                <button
                  className="button bevel-content w-4 h-4"
                  style={{ backgroundColor: color }}
                  key={color}
                  onClick={() => {
                    onValueChange?.(color);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <ColorSlider
                value={r}
                onValueChange={(value) => {
                  setR(value);
                  commitCustomValue();
                }}
                max={255}
                trackProps={{
                  style: {
                    background: `linear-gradient(to right, rgb(0 ${g} ${b}), rgb(255 ${g} ${b}))`,
                  },
                }}
              />
              <ColorSlider
                value={g}
                onValueChange={(value) => {
                  setG(value);
                  commitCustomValue();
                }}
                max={255}
                trackProps={{
                  style: {
                    background: `linear-gradient(to right, rgb(${r} 0 ${b}), rgb(${r} 255 ${b}))`,
                  },
                }}
              />
              <ColorSlider
                value={b}
                onValueChange={(value) => {
                  setB(value);
                  commitCustomValue();
                }}
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
