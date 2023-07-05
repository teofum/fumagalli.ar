import ScrollContainer from '~/components/ui/ScrollContainer';
import Button from '~/components/ui/Button';
import getReadableSize from '../utils/getReadableSize';
import getReadableFileType from '../utils/getReadableFileType';
import FilesListItem from './FilesListItem';
import type FilesViewProps from './FilesViewProps';
import filterByType from '../utils/filterByType';
import { useAppState } from '~/components/desktop/Window/context';

function formatDate(seconds: number) {
  return new Date(seconds * 1000).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',

    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function FilesDetailsView({
  dir,
  open,
  select,
}: FilesViewProps) {
  const [state] = useAppState('files');

  return (
    <ScrollContainer className="flex-1">
      <table className="p-1 select-none min-w-full">
        <thead>
          <tr>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Name</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-right">
                <span>Size</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Type</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Created</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Modified</span>
              </Button>
            </th>
            <th className="p-0">
              <div className="w-full h-4 bg-surface bevel" />
            </th>
          </tr>
        </thead>
        <tbody>
          {filterByType(dir.items, state.typeFilter).map((item) => (
            <tr key={item.name}>
              <td className="min-w-32 w-32 max-w-32 py-0 px-0.5">
                <FilesListItem item={item} open={open} select={select} />
              </td>
              <td className="text-right py-0 px-1 min-w-16 w-16 max-w-16">
                {item.class === 'file' ? getReadableSize(item.size) : null}
              </td>
              <td className="py-0 px-1 min-w-32 w-32 max-w-32">
                {getReadableFileType(item)}
              </td>
              <td className="py-0 px-1 min-w-32 w-32 max-w-32">
                {formatDate(item.created)}
              </td>
              <td className="py-0 px-1 min-w-32 w-32 max-w-32">
                {formatDate(item.modified)}
              </td>
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollContainer>
  );
}
