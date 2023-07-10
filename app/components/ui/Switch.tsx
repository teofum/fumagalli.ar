import * as SwitchPrimitive from '@radix-ui/react-switch';
import cn from 'classnames';

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>;

export default function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'bevel-content w-10 h-5 bg-surface relative data-[state=checked]:bg-checkered',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="absolute top-0.5 left-0.5 bevel bg-surface w-4 h-4 data-[state=checked]:translate-x-5">
        <div
          className="
            absolute top-1 bottom-1 left-1/2 -translate-x-1/2
            flex flex-row gap-0.5
            pointer-events-none
          "
        >
          <div className="w-0.5 bevel-light-inset" />
          <div className="w-0.5 bevel-light-inset" />
          <div className="w-0.5 bevel-light-inset" />
        </div>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}
