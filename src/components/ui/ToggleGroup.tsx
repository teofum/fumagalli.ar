import { forwardRef } from 'react';
import cn from 'classnames';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root>;

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup(
    {
      children,
      orientation = 'horizontal',
      className,
      onValueChange,
      ...props
    },
    ref,
  ) {
    return (
      <ToggleGroupPrimitive.Root
        onValueChange={(value: string & string[]) => {
          if (props.type === 'single' && !value) return;
          onValueChange?.(value);
        }}
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

type ToggleItemProps = {
  noInset?: boolean;
  variant?: 'normal' | 'light';
} & React.ComponentProps<typeof ToggleGroupPrimitive.Item>;

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleItemProps>(
  function ToggleGroupItem(
    { children, className, variant = 'normal', noInset = false, ...props },
    ref,
  ) {
    return (
      <ToggleGroupPrimitive.Item
        className={cn(
          'button toggle-button group',
          {
            'button-normal': variant === 'normal',
            'button-light': variant === 'light',
          },
          className,
        )}
        ref={ref}
        {...props}
      >
        {noInset ? (
          children
        ) : (
          <div
            className="
              group-active:translate-x-px group-active:translate-y-px
              group-data-[state=on]:translate-x-px group-data-[state=on]:translate-y-px
            "
          >
            {children}
          </div>
        )}
      </ToggleGroupPrimitive.Item>
    );
  },
);

type ToggleIconButtonProps = React.ComponentProps<typeof ToggleButton> & {
  label?: string | null;
  imageUrl: string;
};

export const ToggleIconButton = forwardRef<
  HTMLButtonElement,
  ToggleIconButtonProps
>(function ToggleIconButton(
  { className, imageUrl, label = null, children, ...props },
  ref,
) {
  return (
    <ToggleButton
      ref={ref}
      className={cn('p-0.5 min-w-7', className, {
        'w-14': label !== null,
      })}
      {...props}
    >
      <div className="relative mx-auto w-fit group-disabled:text-disabled">
        <img
          className="grayscale group-hover:grayscale-0 group-data-[state=on]:grayscale-0"
          src={imageUrl}
          alt=""
        />
        <span
          className="absolute inset-0 bg-disabled hidden group-disabled:inline"
          style={{
            WebkitMaskImage: `url('${imageUrl}')`,
          }}
        />
      </div>
      {label !== null ? <span>{label}</span> : null}
    </ToggleButton>
  );
});
