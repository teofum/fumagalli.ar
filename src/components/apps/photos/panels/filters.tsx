import { useEffect } from 'react';

import type { ExifStats } from '@/utils/photos/fetch-exif-stats';
import useFetch from '@/hooks/use-fetch';
import { ComboBox } from '@/components/ui/combo-box';
import { useAppState } from '@/components/desktop/Window/context';
import { getLensDisplayName } from '@/utils/photos/get-lens-name';
import Button from '@/components/ui/Button';

const FILTER_TAGS = ['place', 'subject', 'camera', 'lens', 'film'];

export default function Filters() {
  const [state, update] = useAppState('photos');

  const { data, load } = useFetch<{
    tags: { [key: string]: string[] };
    exif: ExifStats;
  }>();

  useEffect(() => {
    load('/api/photos/filters');
  }, [load]);

  if (!data) return null;
  const { tags: allTags, exif } = data;

  const { lens, ...tags } = allTags;
  const lenses = [...new Set([...exif.lenses, ...(lens ?? [])])];

  return (
    <div className="flex flex-col gap-0.5">
      {FILTER_TAGS.map((tag) => (
        <div key={tag} className="flex flex-row gap-1 items-center">
          <div className="w-20 pl-2 capitalize">{tag}</div>
          <ComboBox
            multiple
            immediate
            value={state.filters[tag] ?? []}
            onChange={(val) =>
              update({ filters: { ...state.filters, [tag]: val } })
            }
            options={tag === 'lens' ? lenses : (tags[tag] ?? [])}
            display={tag === 'lens' ? getLensDisplayName : (s) => s}
            placeholder="Any"
          />
        </div>
      ))}

      <Button
        className="px-2 py-1 w-full mt-1.5"
        onClick={() => update({ filters: {} })}
      >
        Clear filters
      </Button>
    </div>
  );
}
