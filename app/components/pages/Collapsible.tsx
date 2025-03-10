import React from 'react';
import type { CollapsibleProps } from '@radix-ui/react-collapsible';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

type Props = CollapsibleProps & {
  title: React.ReactNode,
}

export default function Collapsible({ title, children, ...props }: Props) {
  return (
    <CollapsiblePrimitive.Root className="flex flex-col" {...props}>
      <CollapsiblePrimitive.Trigger className="group border-b border-current p-4 hover:bg-[rgb(from_currentcolor_r_g_b/20%)] transition-colors duration-200">
        <div className="flex flex-row items-center justify-between">
          <div>{title}</div>
          <svg stroke="currentColor"
               fill="currentColor"
               className="group-data-[state='open']:rotate-180 transition-transform duration-200"
               strokeWidth="0"
               viewBox="0 0 256 256"
               height="24px"
               width="24px"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
          </svg>
        </div>
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content className="group/content">
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}