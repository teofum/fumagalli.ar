import { forwardRef } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import cn from 'classnames';

type SliderProps = {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  trackProps?: React.ComponentProps<typeof SliderPrimitive.Track>;
  thumbProps?: React.ComponentProps<typeof SliderPrimitive.Thumb>;
} & Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  'defaultValue' | 'value' | 'onValueChange'
>;

const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    defaultValue,
    value,
    onValueChange,
    className,
    trackProps,
    thumbProps,
    ...props
  },
  ref,
) {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'grow relative flex items-center touch-none h-6',
        className,
      )}
      value={value !== undefined ? [value] : undefined}
      defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
      onValueChange={(value) => onValueChange?.(value[0])}
      {...props}
    >
      <SliderPrimitive.Track
        {...trackProps}
        className={cn('bevel-light-inset h-0.5 w-full', trackProps?.className)}
      />
      <SliderPrimitive.Thumb
        {...thumbProps}
        className={cn(
          'absolute w-2.5 h-5 bg-surface bevel -translate-x-1/2 -translate-y-1/2 outline-none',
          thumbProps?.className,
        )}
      />
    </SliderPrimitive.Root>
  );
});

export default Slider;
