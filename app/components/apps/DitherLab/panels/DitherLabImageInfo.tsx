import { forwardRef, useRef } from 'react';
import { useAppState } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Collapsible from '~/components/ui/Collapsible';
import getReadableSize from '../../Files/utils/getReadableSize';

const DitherLabImageInfo = forwardRef<HTMLImageElement>(
  function DitherLabImageInfo(props, ref) {
    const [state, setState] = useAppState('dither');

    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const uploadImage = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const input = ev.target;
      if (input?.files) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.addEventListener(
          'load',
          () => {
            setState({
              image: {
                filename: file.name,
                url: reader.result as string,
                size: file.size,
              },
            });
          },
          { once: true },
        );
        reader.readAsDataURL(file);
      }
    };

    return (
      <Collapsible defaultOpen title="Source Image">
        <div className="flex flex-col gap-2">
          <input
            type="file"
            className="hidden"
            ref={hiddenInputRef}
            onChange={uploadImage}
          />

          <div className="flex flex-row items-center">
            <span className="grow min-w-0 overflow-hidden text-ellipsis">
              {state.image?.filename || 'No image'}
            </span>
            <Button
              className="py-1 px-2 w-20"
              onClick={() => hiddenInputRef.current?.click()}
            >
              <span>Browse...</span>
            </Button>
          </div>

          <div className="bg-default bevel-light-inset p-px">
            {state.image ? (
              <img
                src={state.image.url}
                alt={state.image.filename}
                ref={ref}
              />
            ) : (
              <div className="text-center p-8">No preview available</div>
            )}
          </div>

          {state.image ? (
            <div className="flex flex-col">
              <div className="flex flex-row justify-between">
                <span>Size</span>
                <span>{getReadableSize(state.image.size)}</span>
              </div>
            </div>
          ) : null}
        </div>
      </Collapsible>
    );
  },
);

export default DitherLabImageInfo;
