import type { CollapsibleProps } from '@radix-ui/react-collapsible';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import cn from 'classnames';
import { ChevronDown } from 'lucide-react';
import React from 'react';

type Props = CollapsibleProps & {
  title: React.ReactNode;
};

export default function Collapsible({
  title,
  children,
  className,
  ...props
}: Props) {
  return (
    <CollapsiblePrimitive.Root
      className={cn('flex flex-col', className)}
      {...props}
    >
      <CollapsiblePrimitive.Trigger className="group border-b border-current p-4 hover:bg-[rgb(from_currentcolor_r_g_b/20%)] transition-colors duration-200">
        <div className="flex flex-row items-center justify-between">
          <div>{title}</div>
          <ChevronDown className="group-data-[state='open']:rotate-180 transition-transform duration-200" />
        </div>
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content className="group/content">
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}
