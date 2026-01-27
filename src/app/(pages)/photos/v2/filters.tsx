'use client';

import { SearchParams } from '@/utils/types';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react';
import { useState } from 'react';

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

  return (
    <Combobox
      multiple
      value={selection}
      onChange={setSelection}
      onClose={() => setQuery('')}
    >
      {selection.length > 0 ? (
        <ul>
          {selection.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
      <ComboboxInput onChange={(ev) => setQuery(ev.target.value)} />
      <ComboboxOptions anchor="bottom">
        {filteredTags.map((tag) => (
          <ComboboxOption key={tag} value={tag}>
            {tag}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
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
    <div>
      {displayTags.map((groupKey) => (
        <Field key={groupKey}>
          <Label>{groupKey}:</Label>
          <FilterCombobox
            tags={tags[groupKey]}
            defaultValue={defaultValues[groupKey]}
          />
        </Field>
      ))}
    </div>
  );
}
