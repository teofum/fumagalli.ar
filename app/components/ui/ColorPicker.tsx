import * as Popover from '@radix-ui/react-popover';
import Button from './Button';
import cn from 'classnames';
import { useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'presets' | 'custom'>('presets');

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
          className="bg-surface bevel-window p-1 z-2000 flex flex-col gap-1"
          align="start"
        >
          {/* <ToggleGroup
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
          </ToggleGroup> */}

          {mode === 'presets' ? (
            <div className="grid grid-cols-8 gap-0.5">
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
            <div>...</div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
