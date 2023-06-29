import { forwardRef } from 'react';
import cn from 'classnames';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root>;

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup(
    { children, orientation = 'horizontal', className, ...props },
    ref,
  ) {
    return (
      <ToggleGroupPrimitive.Root
        className={cn(
          'flex',
          {
            'flex-row': orientation === 'horizontal',
            'flex-col': orientation === 'vertical',
          },
          className,
        )}
        orientation={orientation}
        ref={ref}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    );
  },
);

type ToggleItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item>;

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleItemProps>(
  function ToggleGroupItem({ children, className, ...props }, ref) {
    return (
      <ToggleGroupPrimitive.Item
        className={cn('button px-2 button-normal toggle-button group', className)}
        ref={ref}
        {...props}
      >
        <div
          className="
            group-active:translate-x-px group-active:translate-y-px
            group-data-[state=on]:translate-x-px group-data-[state=on]:translate-y-px
          "
        >
          {children}
        </div>
      </ToggleGroupPrimitive.Item>
    );
  },
);
