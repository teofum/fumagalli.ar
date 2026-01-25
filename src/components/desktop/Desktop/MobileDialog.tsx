import { useState } from 'react';
import Button, { LinkButton } from '@/components/ui/Button';
import Dialog, { DialogClose } from '@/components/ui/Dialog';

export default function MobileDialog() {
  // Assume any small viewport is a phone, because the limitation is screen size anyway
  const isMobile = window.innerWidth < 640;
  const [open, setOpen] = useState(isMobile);

  return (
    <Dialog title="Device Manager" open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-4 px-3 py-2 w-[calc(100vw-2rem)] max-w-full">
        <img
          className="w-8 h-8 self-center"
          src="/fs/System Files/Icons/warning.png"
          alt=""
        />

        <p>
          It looks like you're accessing this website on a mobile device. While
          the site is meant to work on all devices, many applications' UI might
          not fit on a smaller screen. Using a computer or tablet is
          recommended.
        </p>

        <p>
          If you want to check out my articles and projects from this device,
          you can visit the static version of this site, intended for all
          devices. You can also continue to the desktop, but keep in mind some
          things may not display as intended.
        </p>

        <div className="flex flex-col gap-2 mt-16">
          <LinkButton
            href="/about"
            className="p-3 outline-solid outline-1 outline-black"
          >
            <span>Go to mobile site</span>
          </LinkButton>

          <DialogClose asChild>
            <Button className="p-3">
              <span>Continue to desktop anyway</span>
            </Button>
          </DialogClose>
        </div>
      </div>
    </Dialog>
  );
}
