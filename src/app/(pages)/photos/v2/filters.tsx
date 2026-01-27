'use client';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

import { SearchParams } from '@/utils/types';

function FilterCombobox({
  tags,
  defaultValue = [],
}: {
  tags: string[];
  defaultValue?: string | string[];
}) {
  const defaultSelection =
    typeof defaultValue === 'string' ? [defaultValue] : defaultValue;

  const [selection, setSelection] = useState(defaultSelection);
  const [query, setQuery] = useState('');

  const filteredTags = query
    ? tags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    : tags;

  const remove = (tag: string) =>
    setSelection((s) => s.filter((t) => t !== tag));

  return (
    <div className="border min-w-0 p-1 has-focus-visible:border-teal-700 has-focus-visible:outline-2 outline-teal-400/25">
      <Combobox
        multiple
        value={selection}
        onChange={setSelection}
        onClose={() => setQuery('')}
      >
        <ul className="flex flex-row gap-1 flex-wrap min-w-0">
          {selection.length > 0 ? (
            selection.map((tag) => (
              <li
                key={tag}
                className="flex flex-row items-center gap-1 pl-2 p-1 border select-none"
              >
                {tag}
                <button
                  onClick={() => remove(tag)}
                  className="p-1 rounded-full hover:bg-current/10"
                >
                  <X size={12} />
                </button>
              </li>
            ))
          ) : (
            <li className="flex flex-row items-center gap-2 px-2 py-1 border select-none">
              Any
            </li>
          )}
          <ComboboxInput
            className="grow outline-none h-8.5"
            onChange={(ev) => setQuery(ev.target.value)}
          />
        </ul>
        <ComboboxOptions
          anchor={{ to: 'bottom start', gap: 4 }}
          className="font-text text-content-base bg-default/70 backdrop-blur-lg border min-w-80 select-none"
        >
          {filteredTags.map((tag) => (
            <ComboboxOption
              key={tag}
              value={tag}
              className="px-2 py-1 data-focus:bg-current/10 hover:bg-current/10 group flex flex-row items-center gap-2"
            >
              <Check size={16} className="not-group-data-selected:opacity-0" />
              {tag}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

export default function Filters({
  tags,
  defaultValues,
}: {
  tags: { [key: string]: string[] };
  defaultValues: SearchParams;
}) {
  const displayTags = Object.keys(tags).filter((group) => group !== 'type');

  return (
    <div className="grid grid-cols-[20%_1fr] gap-2 mt-4">
      {displayTags.map((groupKey) => (
        <Field
          key={groupKey}
          className="grid grid-cols-subgrid col-start-1 -col-end-1 items-baseline"
        >
          <Label>{groupKey}</Label>
          <FilterCombobox
            tags={tags[groupKey]}
            defaultValue={defaultValues[groupKey]}
          />
        </Field>
      ))}
    </div>
  );
}
