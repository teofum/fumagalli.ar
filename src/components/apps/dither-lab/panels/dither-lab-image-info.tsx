import getReadableSize from '@/components/apps/files/utils/get-readable-size';
import Button from '@/components/ui/Button';
import Collapsible from '@/components/ui/Collapsible';
import Menu from '@/components/ui/Menu';
import ArrowDown from '@/components/ui/icons/ArrowDown';
import useImage from '../utils/use-image';

function getDataUrl(imageData: Uint8Array<ArrayBuffer>) {
  return undefined; // todo
}

type DitherLabImageInfoProps = {
  upload: () => void;
  open: () => void;
};

export default function DitherLabImageInfo({
  upload,
  open,
}: DitherLabImageInfoProps) {
  const image = useImage();

  return (
    <Collapsible defaultOpen title="Source Image">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center">
          <span className="grow min-w-0 overflow-hidden text-ellipsis">
            {image?.meta.filename || 'No image'}
          </span>

          <div className="flex flex-row w-20">
            <Button className="py-1 px-2 grow" onClick={upload}>
              <span>Upload...</span>
            </Button>
            <Menu.Bar>
              <Menu.Menu
                trigger={
                  <Button className="p-1 data-[state=open]:bevel-inset">
                    <ArrowDown />
                  </Button>
                }
                contentProps={{ align: 'end', className: 'min-w-20' }}
              >
                <Menu.Item label="Upload from computer" onSelect={upload} />
                <Menu.Item label="Browse files" onSelect={open} />
              </Menu.Menu>
            </Menu.Bar>
          </div>
        </div>

        <div className="bg-default bevel-light-inset p-px">
          {image ? (
            <img
              src={image.meta.url ?? getDataUrl(image.data)}
              alt={image.meta.filename}
            />
          ) : (
            <div className="text-center p-8">No preview available</div>
          )}
        </div>

        {image ? (
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <span>File Size</span>
              <span>{getReadableSize(image.data.length)}</span>
            </div>

            {image ? (
              <div className="flex flex-row justify-between">
                <span>Dimensions</span>
                <span>
                  {image.meta.width}x{image.meta.height}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Collapsible>
  );
}
