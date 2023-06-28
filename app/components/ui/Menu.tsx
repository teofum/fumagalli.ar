import React from 'react';
import cn from 'classnames';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Check from './icons/Check';
import Dot from './icons/Dot';
import ArrowLeft from './icons/ArrowLeft';

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
      {icon ? <img className="col-start-1" src={icon} alt="" /> : null}
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

type RadioGroupProps = React.ComponentProps<typeof DropdownMenu.RadioGroup>;

function RadioGroup({ children, ...props }: RadioGroupProps) {
  return (
    <DropdownMenu.RadioGroup {...props}>{children}</DropdownMenu.RadioGroup>
  );
}

type RadioItemProps = {
  label: string;
} & React.ComponentProps<typeof DropdownMenu.RadioItem>;

function RadioItem({ label, className, ...props }: RadioItemProps) {
  return (
    <DropdownMenu.RadioItem className={cn('menu-item', className)} {...props}>
      <DropdownMenu.ItemIndicator className="col-start-1">
        <Dot />
      </DropdownMenu.ItemIndicator>
      <span className="col-start-2">{label}</span>
    </DropdownMenu.RadioItem>
  );
}

function Separator() {
  return <DropdownMenu.Separator className="h-0.5 m-1 bevel-light-inset" />;
}

type SubProps = {
  label: string;
  icon?: string;
  contentProps?: React.ComponentProps<typeof DropdownMenu.SubContent>;
} & React.ComponentProps<typeof DropdownMenu.SubTrigger>;

function Sub({
  label,
  icon,
  className,
  contentProps,
  children,
  ...props
}: SubProps) {
  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger className={cn('menu-item menu-sub', className)} {...props}>
        {icon ? <img className="col-start-1" src={icon} alt="" /> : null}
        <span className="col-start-2">{label}</span>
        <div className="w-3 h-3"><ArrowLeft /></div>
      </DropdownMenu.SubTrigger>

      <DropdownMenu.Portal>
        <DropdownMenu.SubContent
          sideOffset={-4}
          alignOffset={-2}
          {...contentProps}
          className={cn('menu-content', contentProps?.className)}
        >
          {children}
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
}

export default {
  Root,
  Trigger,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Separator,
  Sub,
};
