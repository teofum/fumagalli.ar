import cn from 'classnames';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export default function Divider({
  className,
  orientation = 'horizontal',
}: DividerProps) {
  return (
    <div
      className={cn('bevel-light-inset self-stretch', className, {
        'h-0.5': orientation === 'horizontal',
        'w-0.5': orientation === 'vertical',
      })}
    />
  );
}
