import useDesktopStore from "@/stores/desktop";
import { useWindow } from "../desktop/Window/context";
import Collapsible from "./Collapsible";
import ScrollContainer from "./ScrollContainer";
import { useEffect } from "react";
import { WindowSizingMode } from "@/components/desktop/Window/WindowSizingMode";
import Button from "./Button";

export default function ApplicationError({ error }: { error: unknown }) {
  const { setWindowProps } = useDesktopStore();
  const { id, close } = useWindow();

  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const stack = error instanceof Error ? error.stack : "No stack trace";

  useEffect(() => {
    setWindowProps(id, {
      sizingX: WindowSizingMode.FIXED,
      sizingY: WindowSizingMode.AUTO,
      width: 400,
      maximized: false,
      maximizable: false,
    });
  }, [id, setWindowProps]);

  return (
    <div className="flex flex-row items-start gap-4 p-2 min-w-0">
      <img className="min-w-8" src="/fs/System Files/Icons/error.png" alt="" />
      <div className="grow flex flex-col gap-2 min-w-0">
        <p>
          The application encountered an error and was shut down. Error:{" "}
          {errorMessage}
        </p>

        <Collapsible
          title="Error details"
          className="min-w-0 min-h-0 flex flex-col"
        >
          <ScrollContainer className="min-h-0">
            <pre className="font-sans text-base p-2">{stack}</pre>
          </ScrollContainer>
        </Collapsible>

        <Button className="py-1 px-2 w-20 self-end" onClick={close}>
          Close
        </Button>
      </div>
    </div>
  );
}
