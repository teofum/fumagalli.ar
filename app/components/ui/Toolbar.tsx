import cn from 'classnames';
import { forwardRef } from 'react';

export const ToolbarGroup = forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(function ToolbarGroup({ children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('bevel-light-inset p-px select-none', className)}
      {...props}
    >
      {children}
    </div>
  );
});

export const Toolbar = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  function Toolbar({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex flex-row items-center bevel-light p-px', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
