import ScrollContainer from '~/components/ui/ScrollContainer';
import Toolbar from '~/components/ui/Toolbar';
// import Button from '~/components/ui/Button';

import DitherLabImageInfo from './panels/DitherLabImageInfo';
import DitherLabResizeOptions from './panels/DitherLabResizeOptions';
import GlRenderer from './renderers/GlRenderer';

export default function DitherLab() {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex flex-row gap-1">Menu</div>

      <div className="grow flex flex-row gap-0.5 min-h-0">
        <div className="grow flex flex-col gap-0.5 min-w-0">
          <Toolbar>
            Toolbar
          </Toolbar>
          <ScrollContainer centerContent className="grow min-w-0 min-h-0">
            <GlRenderer />
          </ScrollContainer>
        </div>

        <div className="flex flex-col bevel-content w-56 min-w-56 p-0.5">
          <DitherLabImageInfo />
          <DitherLabResizeOptions />
        </div>
      </div>
    </div>
  );
}
