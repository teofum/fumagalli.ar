import cn from 'classnames';
import React from 'react';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { variant?: 'normal' | 'light' }
>(function Button({ children, className, variant = 'normal', ...props }, ref) {
  return (
    <button
      className={cn(
        'button group',
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
          group-data-[state=open]:translate-x-px group-data-[state=open]:translate-y-px
        "
      >
        {children}
      </div>
    </button>
  );
});

export default Button;
