import ScrollContainer from '~/components/ui/ScrollContainer';
import Toolbar from '~/components/ui/Toolbar';
// import Button from '~/components/ui/Button';

import DitherLabImageInfo from './panels/DitherLabImageInfo';
import DitherLabResizeOptions from './panels/DitherLabResizeOptions';
import GlRenderer from './renderers/GlRenderer';
import DitherLabRenderOptions from './panels/DitherLabRenderOptions';

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

        <ScrollContainer hide="x" className="w-64 min-w-64">
          <div className="flex flex-col w-60 min-w-60">
            <DitherLabImageInfo />
            <DitherLabResizeOptions />
            <DitherLabRenderOptions />
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
}
