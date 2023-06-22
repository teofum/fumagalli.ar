import cn from 'classnames';
import React from 'react';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(function Button({ children, className, ...props }, ref) {
  return (
    <button
      className={cn(
        'bg-surface bevel cursor-default group active:bevel-inset p-0.5',
        className,
      )}
      {...props}
      ref={ref}
    >
      <div className="group-active:translate-x-px group-active:translate-y-px">
        {children}
      </div>
    </button>
  );
});

export default Button;
