'use client';

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react';
import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

import { SearchParams } from '@/utils/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ExifStats } from './fetch-exif-stats';
import { getLensDisplayName } from './get-lens-name';

function FilterCombobox({
  tags,
  defaultValue = [],
  onChange = () => {},
  display = (s) => s,
}: {
  tags: string[];
  defaultValue?: string | string[];
  onChange?: (value: string[]) => void;
  display?: (value: string) => string;
}) {
  const defaultSelection =
    typeof defaultValue === 'string' ? [defaultValue] : defaultValue;

  const [selection, setSelection] = useState(defaultSelection);
  const [query, setQuery] = useState('');

  const select = (s: string[]) => {
    setSelection(s);
    onChange(s);
  };

  const filteredTags = query
    ? tags.filter((tag) =>
        display(tag).toLowerCase().includes(query.toLowerCase()),
      )
    : tags;

  filteredTags.sort();

  const remove = (tag: string) => select(selection.filter((t) => t !== tag));
  const removeLast = () => select(selection.slice(0, -1));

  return (
    <div className="border min-w-0 p-1 has-focus-visible:border-teal-700 has-focus-visible:outline-2 outline-teal-400/25">
      <Combobox
        multiple
        immediate
        value={selection}
        onChange={select}
        onClose={() => setQuery('')}
      >
        <ul className="flex flex-row gap-1 flex-wrap min-w-0">
          {selection.length > 0 ? (
            selection.map((tag) => (
              <li
                key={tag}
                className="flex flex-row items-center gap-1 pl-2 p-1 border select-none"
              >
                {display(tag)}
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
          <div className="flex flex-row min-w-0 flex-1">
            <ComboboxInput
              className="flex-1 outline-none h-8.5 min-w-0"
              onChange={(ev) => setQuery(ev.target.value)}
              onKeyDown={(ev) => {
                if (
                  ev.key === 'Backspace' &&
                  ev.currentTarget.value.length === 0
                ) {
                  ev.preventDefault();
                  removeLast();
                }
              }}
            />
            <ComboboxButton className="hover:bg-current/10 w-8.5 h-8.5 grid place-items-center group">
              <ChevronDown
                size={16}
                className="group-data-open:rotate-180 transition-transform duration-200"
              />
            </ComboboxButton>
          </div>
        </ul>
        <ComboboxOptions
          anchor={{ to: 'bottom start', gap: 4 }}
          className="font-text text-content-base bg-default/70 backdrop-blur-lg border min-w-80 select-none z-200"
        >
          {filteredTags.map((tag) => (
            <ComboboxOption
              key={tag}
              value={tag}
              className="px-2 py-1 data-focus:bg-current/10 hover:bg-current/10 group flex flex-row items-center gap-2"
            >
              <Check size={16} className="not-group-data-selected:opacity-0" />
              {display(tag)}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

const BASIC_TAGS = ['place', 'subject'];

export default function Filters({
  tags: allTags,
  defaultValues,
  exif,
}: {
  tags: { [key: string]: string[] };
  defaultValues: SearchParams;
  exif: ExifStats;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();

  const [all, setAll] = useState(false);

  // Lens tags are handled specially
  const { lens, ...tags } = allTags;

  const displayTags = Object.keys(tags).filter((group) => group !== 'type');
  const basicTags = displayTags.filter((tag) => BASIC_TAGS.includes(tag));
  const otherTags = displayTags.filter((tag) => !BASIC_TAGS.includes(tag));

  const lensOptions = [...new Set([...exif.lenses, ...(lens ?? [])])];

  const changeHandler = (groupKey: string, tags: string[]) => {
    const newSearch = new URLSearchParams(search);
    newSearch.delete(groupKey);
    for (const tag of tags) newSearch.append(groupKey, tag);

    router.replace(`${pathname}?${newSearch.toString()}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-[6rem_1fr] lg:grid-cols-[5rem_1fr_5rem_1fr] gap-2 pt-4 pb-2 border-b">
      {basicTags.map((groupKey) => (
        <Field
          key={groupKey}
          className="grid grid-cols-subgrid col-span-2 pl-4 items-baseline"
        >
          <Label className="capitalize">{groupKey}</Label>
          <FilterCombobox
            tags={tags[groupKey]}
            defaultValue={defaultValues[groupKey]}
            onChange={(tags) => changeHandler(groupKey, tags)}
          />
        </Field>
      ))}

      {all ? (
        <>
          <Field className="grid grid-cols-subgrid col-span-2 pl-4 items-baseline">
            <Label className="capitalize">Camera</Label>
            <FilterCombobox
              tags={tags['camera']}
              defaultValue={defaultValues['camera']}
              onChange={(tags) => changeHandler('camera', tags)}
            />
          </Field>
          <Field className="grid grid-cols-subgrid col-span-2 pl-4 items-baseline">
            <Label className="capitalize">Lens</Label>
            <FilterCombobox
              tags={lensOptions}
              display={getLensDisplayName}
              defaultValue={defaultValues['lens']}
              onChange={(tags) => changeHandler('lens', tags)}
            />
          </Field>
          <Field className="grid grid-cols-subgrid col-span-2 pl-4 items-baseline">
            <Label className="capitalize">Film</Label>
            <FilterCombobox
              tags={tags['film']}
              defaultValue={defaultValues['film']}
              onChange={(tags) => changeHandler('film', tags)}
            />
          </Field>
        </>
      ) : null}

      <div className="col-start-1 -col-end-1 flex flex-row justify-end">
        <button
          className="text-content-sm px-2 py-1 hover:bg-current/10 w-full"
          onClick={() => setAll(!all)}
        >
          Show {all ? 'less' : 'more'}
        </button>
      </div>
    </div>
  );
}
