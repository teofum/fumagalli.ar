import DitherLabImageInfo from './panels/DitherLabImageInfo';

export default function DitherLab() {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-row gap-1">Menu</div>

      <div className="grow flex flex-row gap-0.5">
        <div className="grow flex flex-col bg-default bevel-content p-0.5">
          <div className="flex flex-row p-2 bg-surface bevel">Toolbar</div>
          <div className="grow p-2">Content</div>
        </div>

        <div className="flex flex-col bevel-content w-56 p-0.5">
          <DitherLabImageInfo />
        </div>
      </div>
    </div>
  );
}
