import { useState } from "react";
import Dialog, { DialogClose } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import useDesktopStore from "@/stores/desktop";

type ComputerState = "on" | "off" | "shutting-down";

export default function ShutdownDialog() {
  const { windows, close, shutdownDialog, openShutdown } = useDesktopStore();

  const [computerState, setComputerState] = useState<ComputerState>("on");

  const shutdown = () => {
    setComputerState("shutting-down");

    windows.forEach(({ id }, i) => setTimeout(() => close(id), i * 150));
    setTimeout(() => {
      setComputerState("off");
      openShutdown(false);
    }, windows.length * 150);
  };

  return (
    <>
      <Dialog
        title="Shut Down"
        open={shutdownDialog}
        onOpenChange={openShutdown}
      >
        <div className="flex flex-col gap-4 px-3 py-2">
          <div className="flex flex-row gap-4">
            <img src="/fs/System Files/Icons/shutdown.png" alt="" />
            <div>
              {computerState === "on"
                ? "Are you sure you want to shut down the system?"
                : "Shutting down..."}
            </div>
          </div>

          <div className="flex flex-row justify-end gap-2">
            <Button
              className="w-20 p-1 outline-solid outline-1 outline-black"
              onClick={shutdown}
              disabled={computerState !== "on"}
            >
              <span>OK</span>
            </Button>

            <DialogClose asChild>
              <Button className="w-20 p-1" disabled={computerState !== "on"}>
                <span>Cancel</span>
              </Button>
            </DialogClose>
          </div>
        </div>
      </Dialog>

      {computerState === "off" ? (
        <div className="fixed inset-0 z-6000 bg-black flex flex-row items-center justify-center">
          <img
            src="/fs/System Files/shutdown.png"
            alt="It's now safe to turn off your computer."
            className="w-full"
          />
        </div>
      ) : null}
    </>
  );
}
