import { type ComponentProps, forwardRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import cn from 'classnames';

export const Tabs = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof TabsPrimitive.Root>
>(function Tabs({ className, children, ...props }, ref) {
  return (
    <TabsPrimitive.Root ref={ref} className={cn('tabs', className)} {...props}>
      {children}
    </TabsPrimitive.Root>
  );
});

export const TabsList = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof TabsPrimitive.List>
>(function TabsList({ className, children, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn('tabs-list', className)}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
});

export const Tab = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof TabsPrimitive.Trigger>
>(function Tab({ className, children, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn('tab', className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
});

export const TabContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof TabsPrimitive.Content>
>(function TabContent({ className, children, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('tab-content', className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  );
});
