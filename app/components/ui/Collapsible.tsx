import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import cn from 'classnames';
import ArrowDown from './icons/ArrowDown';

type CollapsibleProps = {
  title: string;
} & React.ComponentProps<typeof CollapsiblePrimitive.Root>;

export default function Collapsible({
  title,
  className,
  children,
  ...props
}: CollapsibleProps) {
  return (
    <CollapsiblePrimitive.Root
      className={cn('bg-surface bevel group/collapse', className)}
      {...props}
    >
      <CollapsiblePrimitive.Trigger className="py-0.5 px-2 w-full flex flex-row items-center gap-2 cursor-default">
        <span>{title}</span>
        <div className="grow h-1.5 border-t border-b border-light" />
        <ArrowDown className="group-data-[state=open]/collapse:rotate-180" />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="p-3">
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}
