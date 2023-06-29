import Max from '~/components/ui/icons/Max';
import Close from '~/components/ui/icons/Close';

export default function ThemePreview() {
  return (
    <div className="w-96 h-60 bevel-content bg-desktop relative pointer-events-none">
      <div className="bg-surface bevel-window absolute top-4 left-8 w-64 h-40 p-1 flex flex-col gap-0.5">
        <div className="flex flex-row items-center gap-2 px-0.5 py-px">
          <img src={`/fs/system/Resources/Icons/FileType/app_16.png`} alt="" />

          <div className="flex-1 h-1.5 border-t border-b border-disabled drop-shadow-disabled" />
          <span className="font-title bold text-disabled">Inactive Window</span>
          <div className="flex-1 h-1.5 border-t border-b border-disabled drop-shadow-disabled" />

          <div className="flex flex-row">
            <div className="button button-normal">
              <Max />
            </div>
            <div className="button button-normal">
              <Close />
            </div>
          </div>
        </div>

        <div className="bg-default bevel-content flex-1 p-2">
          <div>Window Text</div>
        </div>
      </div>

      <div className="bg-surface bevel-window absolute top-16 left-24 w-60 h-40 p-1 flex flex-col gap-0.5">
        <div className="flex flex-row items-center gap-2 px-0.5 py-px">
          <img src={`/fs/system/Resources/Icons/FileType/app_16.png`} alt="" />

          <div className="flex-1 h-1.5 border-t border-b border-light" />
          <span className="font-title bold">Active Window</span>
          <div className="flex-1 h-1.5 border-t border-b border-light" />

          <div className="flex flex-row">
            <div className="button button-normal">
              <Max />
            </div>
            <div className="button button-normal">
              <Close />
            </div>
          </div>
        </div>

        <div className="bg-default bevel-content flex-1 p-2">
          <div>Window text</div>
        </div>

        <div className="flex flex-row gap-1 p-0.5 justify-end">
          <div className="button button-normal text-center px-2 py-1 w-20">
            OK
          </div>
          <div className="button button-normal text-center px-2 py-1 w-20">
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
}
