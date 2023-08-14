import React from 'react';
import cn from 'classnames';
import * as Toggle from '@radix-ui/react-toggle';

const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Toggle.Root> & { variant?: 'normal' | 'light' }
>(function ToggleButton(
  { children, className, variant = 'normal', ...props },
  ref,
) {
  return (
    <Toggle.Root
      className={cn(
        'button toggle-button group',
        {
          'button-normal': variant === 'normal',
          'button-light': variant === 'light',
        },
        className,
      )}
      {...props}
      ref={ref}
    >
      <div
        className="
          group-active:translate-x-px group-active:translate-y-px
          group-data-[active]:translate-x-px group-data-[active]:translate-y-px
          group-data-[state=on]:translate-x-px group-data-[state=on]:translate-y-px
        "
      >
        {children}
      </div>
    </Toggle.Root>
  );
});

interface ToggleIconButtonProps
  extends React.ComponentProps<typeof ToggleButton> {
  label?: string | null;
  imageUrl: string;
}

export const ToggleIconButton = React.forwardRef<
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

export default ToggleButton;
