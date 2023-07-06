import ScrollContainer from '~/components/ui/ScrollContainer';
import Toolbar from '~/components/ui/Toolbar';

import DitherLabImageInfo from './panels/DitherLabImageInfo';
import DitherLabResizeOptions from './panels/DitherLabResizeOptions';
import GlRenderer from './renderers/GlRenderer';
import DitherLabRenderOptions from './panels/DitherLabRenderOptions';
import DitherLabPaletteSelect from './panels/DitherLabPaletteSelect';

export default function DitherLab() {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex flex-row gap-1">Menu</div>

      <div className="grow flex flex-row gap-0.5 min-h-0">
        <div className="grow flex flex-col gap-0.5 min-w-0">
          <Toolbar>Toolbar</Toolbar>
          <ScrollContainer centerContent className="grow min-w-0 min-h-0">
            <GlRenderer />
          </ScrollContainer>
        </div>

        <ScrollContainer hide="x" className="bg-surface w-[14.5rem] min-w-[14.5rem]">
          <div className="flex flex-col w-[13.5rem] min-w-[13.5rem]">
            <DitherLabImageInfo />
            <DitherLabResizeOptions />
            <DitherLabPaletteSelect />
            <DitherLabRenderOptions />
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
}
