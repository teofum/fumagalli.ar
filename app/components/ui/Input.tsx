import cn from 'classnames';
import { forwardRef } from 'react';

type InputProps = {
  numeric?: 'integer' | 'float';
} & React.ComponentProps<'input'>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { numeric, className, ...props },
  ref,
) {
  const keyDownHandler = (ev: React.KeyboardEvent) => {
    const key = ev.key;
    const value = (ev.target as HTMLInputElement).value;

    let allowed = false;
    if (key === 'Backspace' || key.startsWith('Arrow')) allowed = true;
    if (key.match(/[0-9]/)) allowed = true;
    if (numeric === 'float' && key === '.' && !value.includes('.'))
      allowed = true;

    if (!allowed) ev.preventDefault();
  };

  return (
    <input
      ref={ref}
      onKeyDown={numeric ? keyDownHandler : undefined}
      className={cn('input', className)}
      {...props}
    />
  );
});

export default Input;
