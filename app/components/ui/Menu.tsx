import React from 'react';
import cn from 'classnames';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Check from './icons/Check';

type MenuProps = React.PropsWithChildren<
  {
    trigger: React.ReactNode;
    contentProps?: React.ComponentProps<typeof DropdownMenu.Content>;
  } & React.ComponentProps<typeof DropdownMenu.Root>
>;

function Root({ children, trigger, contentProps, ...props }: MenuProps) {
  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          {...contentProps}
          className={cn('menu-content', contentProps?.className)}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(function MenuTrigger({ children, className, ...props }, ref) {
  return (
    <button
      className={cn(
        'button shadow-none hover:bevel-light px-1.5 py-0.5',
        'active:bevel-light-inset data-[state=open]:bevel-light-inset',
        className,
      )}
      {...props}
      ref={ref}
    >
      <div>{children}</div>
    </button>
  );
});

type ItemProps = {
  label: string;
  icon?: string;
} & React.ComponentProps<typeof DropdownMenu.Item>;

function Item({ label, icon, className, ...props }: ItemProps) {
  return (
    <DropdownMenu.Item className={cn('menu-item', className)} {...props}>
      {icon ? (
        <img className="col-start-1" src={`/img/icon/${icon}_16.png`} alt="" />
      ) : null}
      <span className="col-start-2">{label}</span>
    </DropdownMenu.Item>
  );
}

type CheckboxItemProps = {
  label: string;
} & React.ComponentProps<typeof DropdownMenu.CheckboxItem>;

function CheckboxItem({ label, className, ...props }: CheckboxItemProps) {
  return (
    <DropdownMenu.CheckboxItem
      className={cn('menu-item', className)}
      {...props}
    >
      <DropdownMenu.ItemIndicator className="col-start-1">
        <Check />
      </DropdownMenu.ItemIndicator>
      <span className="col-start-2">{label}</span>
    </DropdownMenu.CheckboxItem>
  );
}

function Separator() {
  return <DropdownMenu.Separator className="h-0.5 m-1 bevel-light-inset" />;
}

export default {
  Root,
  Trigger,
  Item,
  CheckboxItem,
  Separator,
};
