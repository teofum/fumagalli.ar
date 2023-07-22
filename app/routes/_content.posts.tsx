import { Outlet } from '@remix-run/react';
import Button from '~/components/ui/Button';
import Close from '~/components/ui/icons/Close';

export default function PostsRoute() {
  return (
    <div className="bg-surface bevel-window p-1 max-w-max mx-auto">
      <div className="select-none flex flex-row items-center gap-2 px-0.5 py-px mb-0.5">
        <img src={`/fs/system/Applications/preview/icon_16.png`} alt="" />

        <div className="flex-1 h-1.5 border-t border-b border-light" />

        <span className="text-title bold">Preview</span>

        <div className="flex-1 h-1.5 border-t border-b border-light" />

        <div className="flex flex-row">
          <Button>
            <Close />
          </Button>
        </div>
      </div>

      <div className="bg-default bevel-content p-0.5">
        <article className="p-4 max-w-3xl mx-auto font-text text-content-base">
          <Outlet />
        </article>
      </div>
    </div>
  );
}
