import { useRef } from 'react';
import { useAppState } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Collapsible from '~/components/ui/Collapsible';
import getReadableSize from '../../Files/utils/getReadableSize';

export default function DitherLabImageInfo() {
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

  const onLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = ev.target as HTMLImageElement;
    setState({ naturalWidth, naturalHeight });
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
              onLoad={onLoad}
            />
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
