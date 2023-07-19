import React from 'react';
import cn from 'classnames';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import Check from './icons/Check';
import Dot from './icons/Dot';
import ArrowLeft from './icons/ArrowLeft';

type MenuProps = React.PropsWithChildren<
  {
    content: React.ReactNode;
    contentProps?: React.ComponentProps<typeof ContextMenuPrimitive.Content>;
  } & React.ComponentProps<typeof ContextMenuPrimitive.Root>
>;

function Root({ children, content, contentProps, ...props }: MenuProps) {
  return (
    <ContextMenuPrimitive.Root {...props}>
      <ContextMenuPrimitive.Trigger asChild>
        {children}
      </ContextMenuPrimitive.Trigger>

      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content
          {...contentProps}
          className={cn('menu-content menu-context', contentProps?.className)}
        >
          {content}
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
}

type ItemProps = {
  label: string;
  icon?: string;
} & React.ComponentProps<typeof ContextMenuPrimitive.Item>;

function Item({ label, icon, className, ...props }: ItemProps) {
  return (
    <ContextMenuPrimitive.Item
      className={cn('menu-item', className)}
      {...props}
    >
      {icon ? <img className="col-start-1" src={icon} alt="" /> : null}
      <span className="col-start-2">{label}</span>
    </ContextMenuPrimitive.Item>
  );
}

type CheckboxItemProps = {
  label: string;
} & React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>;

function CheckboxItem({ label, className, ...props }: CheckboxItemProps) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      className={cn('menu-item', className)}
      {...props}
    >
      <ContextMenuPrimitive.ItemIndicator className="col-start-1">
        <Check />
      </ContextMenuPrimitive.ItemIndicator>
      <span className="col-start-2">{label}</span>
    </ContextMenuPrimitive.CheckboxItem>
  );
}

type RadioGroupProps = React.ComponentProps<
  typeof ContextMenuPrimitive.RadioGroup
>;

function RadioGroup({ children, ...props }: RadioGroupProps) {
  return (
    <ContextMenuPrimitive.RadioGroup {...props}>
      {children}
    </ContextMenuPrimitive.RadioGroup>
  );
}

type RadioItemProps = {
  label: string;
} & React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>;

function RadioItem({ label, className, ...props }: RadioItemProps) {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn('menu-item', className)}
      {...props}
    >
      <ContextMenuPrimitive.ItemIndicator className="col-start-1">
        <Dot />
      </ContextMenuPrimitive.ItemIndicator>
      <span className="col-start-2">{label}</span>
    </ContextMenuPrimitive.RadioItem>
  );
}

function Separator() {
  return (
    <ContextMenuPrimitive.Separator className="h-0.5 m-1 bevel-light-inset" />
  );
}

type SubProps = {
  label: string;
  icon?: string;
  contentProps?: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>;
} & React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger>;

function Sub({
  label,
  icon,
  className,
  contentProps,
  children,
  ...props
}: SubProps) {
  return (
    <ContextMenuPrimitive.Sub>
      <ContextMenuPrimitive.SubTrigger
        className={cn('menu-item menu-sub', className)}
        {...props}
      >
        {icon ? <img className="col-start-1" src={icon} alt="" /> : null}
        <span className="col-start-2">{label}</span>
        <div className="w-3 h-3">
          <ArrowLeft />
        </div>
      </ContextMenuPrimitive.SubTrigger>

      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.SubContent
          sideOffset={-4}
          alignOffset={-2}
          {...contentProps}
          className={cn('menu-content', contentProps?.className)}
        >
          {children}
        </ContextMenuPrimitive.SubContent>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Sub>
  );
}

export default {
  Root,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Separator,
  Sub,
};
