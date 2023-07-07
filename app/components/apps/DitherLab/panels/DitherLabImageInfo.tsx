import { useAppState } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Collapsible from '~/components/ui/Collapsible';
import getReadableSize from '~/components/apps/Files/utils/getReadableSize';
import Menu from '~/components/ui/Menu';
import ArrowDown from '~/components/ui/icons/ArrowDown';

interface DitherLabImageInfoProps {
  upload: () => void;
  open: () => void;
}

export default function DitherLabImageInfo({
  upload,
  open,
}: DitherLabImageInfoProps) {
  const [state] = useAppState('dither');

  return (
    <Collapsible defaultOpen title="Source Image">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center">
          <span className="grow min-w-0 overflow-hidden text-ellipsis">
            {state.image?.filename || 'No image'}
          </span>

          <div className="flex flex-row w-20">
            <Button className="py-1 px-2 grow" onClick={upload}>
              <span>Upload...</span>
            </Button>
            <Menu.Root
              trigger={
                <Button className="p-1 data-[state=open]:bevel-inset">
                  <ArrowDown />
                </Button>
              }
              contentProps={{ align: 'end', className: 'min-w-20' }}
            >
              <Menu.Item label="Upload from computer" onSelect={upload} />
              <Menu.Item label="Browse files" onSelect={open} />
            </Menu.Root>
          </div>
        </div>

        <div className="bg-default bevel-light-inset p-px">
          {state.image ? (
            <img src={state.image.url} alt={state.image.filename} />
          ) : (
            <div className="text-center p-8">No preview available</div>
          )}
        </div>

        {state.image ? (
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <span>File Size</span>
              <span>{getReadableSize(state.image.size)}</span>
            </div>

            {state.naturalWidth ? (
              <div className="flex flex-row justify-between">
                <span>Dimensions</span>
                <span>
                  {state.naturalWidth}x{state.naturalHeight}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Collapsible>
  );
}
