import { useRef, useState } from 'react';

import { useAppState, useWindow } from '~/components/desktop/Window/context';
import ScrollContainer from '~/components/ui/ScrollContainer';

import DitherLabImageInfo from './panels/DitherLabImageInfo';
import DitherLabResizeOptions from './panels/DitherLabResizeOptions';
import GlRenderer from './renderers/GlRenderer';
import DitherLabRenderOptions from './panels/DitherLabRenderOptions';
import DitherLabPaletteSelect from './panels/DitherLabPaletteSelect';
import { files } from '../Files';
import Menu from '~/components/ui/Menu';
import Button from '~/components/ui/Button';

export default function DitherLab() {
  const { close, modal } = useWindow();
  const [state, setState] = useAppState('dither');

  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const [rt, setRt] = useState<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

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

  const upload = () => hiddenInputRef.current?.click();

  const open = () => {
    modal(
      files({
        path: '/Documents',
        typeFilter: ['image'],
        modalCallback: (file, path) =>
          setState({
            image: {
              filename: file.name,
              size: file.size,
              url: `/fs${path}`,
            },
          }),
      }),
    );
  };

  const download = () => {
    if (!rt || !state.image) return;
    const dataUrl = rt
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    let filename = state.image.filename.split('.').slice(0, -1).join('.');
    filename = `${filename} - ${state.palette.name}.png`;

    const link = document.createElement('a');
    link.setAttribute('download', filename);
    link.setAttribute('href', dataUrl);
    link.click();
  };

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <input
        type="file"
        className="hidden"
        ref={hiddenInputRef}
        onChange={uploadImage}
      />
      {state.image ? (
        <img
          src={state.image.url}
          alt=""
          className="hidden"
          ref={(el) => setImg(el)}
          onLoad={onLoad}
        />
      ) : null}

      <div className="flex flex-row gap-1">
        <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Upload..." onSelect={upload} />
          <Menu.Item label="Open..." onSelect={open} />

          <Menu.Separator />

          <Menu.Item label="Save" onSelect={download} />

          <Menu.Separator />

          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Root>
      </div>

      <div className="grow flex flex-row gap-0.5 min-h-0">
        <div className="grow flex flex-col gap-0.5 min-w-0">
          <div className="flex flex-row bevel-light-inset p-px select-none">
            <div className="grow flex flex-row items-center bevel-light p-px">
              <Button variant="light" className="p-1" onClick={download}>
                <img src="fs/system/Resources/UI/save2.png" alt="Save" />
              </Button>
            </div>
          </div>
          <ScrollContainer centerContent className="grow min-w-0 min-h-0">
            <GlRenderer rt={rt} img={img} setRt={setRt} />
          </ScrollContainer>
        </div>

        <ScrollContainer
          hide="x"
          className="bg-surface w-[14.5rem] min-w-[14.5rem]"
        >
          <div className="flex flex-col w-[13.5rem] min-w-[13.5rem]">
            <DitherLabImageInfo upload={upload} open={open} />
            <DitherLabResizeOptions />
            <DitherLabPaletteSelect />
            <DitherLabRenderOptions />
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
}
