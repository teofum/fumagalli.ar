import * as R from '@radix-ui/react-radio-group';
import cn from 'classnames';
import Radio from './icons/Radio';
import RadioDot from './icons/RadioDot';

type RadioGroupProps = R.RadioGroupProps;

export function RadioGroup({
  children,
  className,
  orientation = 'vertical',
  ...props
}: RadioGroupProps) {
  return (
    <R.RadioGroup
      className={cn('flex', className, {
        'flex-col gap-2': orientation === 'vertical',
        'flex-row gap-5': orientation === 'horizontal',
      })}
      orientation={orientation}
      {...props}
    >
      {children}
    </R.RadioGroup>
  );
}

type RadioButtonProps = R.RadioGroupItemProps;

export function RadioButton({
  children,
  className,
  id,
  ...props
}: RadioButtonProps) {
  return (
    <div className={cn('flex flex-row items-center')}>
      <R.RadioGroupItem id={id} {...props} className="relative w-3 h-3">
        <Radio className="absolute inset-0" />
        <R.RadioGroupIndicator>
          <RadioDot className="absolute inset-0" />
        </R.RadioGroupIndicator>
      </R.RadioGroupItem>
      <label className="pl-2" htmlFor={id}>
        {children}
      </label>
    </div>
  );
}
