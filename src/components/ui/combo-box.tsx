import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptionProps,
  ComboboxOptions,
  ComboboxProps,
} from '@headlessui/react';
import { ReactNode, useState } from 'react';
import cn from 'classnames';

import ArrowDown from './icons/ArrowDown';
import Check from './icons/Check';

function ComboBoxItem({
  children,
  ...props
}: Omit<ComboboxOptionProps, 'children'> & { children: ReactNode }) {
  return (
    <ComboboxOption
      className="px-1 py-0.5 data-focus:bg-selection data-focus:text-selection hover:bg-selection hover:text-selection group flex flex-row items-center gap-1"
      {...props}
    >
      <Check className="not-group-data-selected:opacity-0" />
      {children}
    </ComboboxOption>
  );
}

type ComboBoxProps<T> = Omit<
  ComboboxProps<unknown, undefined>,
  'children' | 'value' | 'multiple' | 'onChange'
> & {
  display?: (value: T) => string;
  key?: (value: T) => string;
  options: T[];
  placeholder?: string;
} & (
    | { multiple: true; value: T[]; onChange: (value: T[]) => void }
    | { multiple: false | undefined; value: T; onChange: (value: T) => void }
  );

export function ComboBox<T>({
  multiple,
  value,
  onChange,
  options,
  placeholder = '',
  display = (value) => `${value}`,
  key = (value) => `${value}`,
  ...props
}: ComboBoxProps<T>) {
  const [query, setQuery] = useState('');

  return (
    <div className="bevel-content p-0.5">
      <Combobox
        multiple={multiple}
        value={value as unknown}
        onChange={onChange as (v: unknown) => void}
        onClose={() => setQuery('')}
        {...props}
      >
        <div className="flex flex-row min-w-0 flex-1">
          <ComboboxInput
            placeholder={
              (multiple ? value.map(display).join(', ') : display(value)) ||
              placeholder
            }
            className={cn('flex-1 input py-0.5 px-1.5 shadow-none! min-w-0', {
              'placeholder:text-default': value,
            })}
            onChange={(ev) => setQuery(ev.target.value)}
          />
          <ComboboxButton className="group button button-normal">
            <ArrowDown className="group-data-open:rotate-180" />
          </ComboboxButton>
        </div>
        <ComboboxOptions
          anchor={{ to: 'bottom start' }}
          className="bg-default border select-none z-100 w-(--input-width)"
        >
          {options
            .filter((opt) => display(opt).includes(query))
            .map((opt) => (
              <ComboBoxItem key={key(opt)} value={key(opt)}>
                {display(opt)}
              </ComboBoxItem>
            ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
