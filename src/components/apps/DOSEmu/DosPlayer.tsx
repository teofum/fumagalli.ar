import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import type { DosPlayer as Instance, DosPlayerFactoryType } from "js-dos";
import loadAsyncScript from "@/utils/loadAsyncScript";

declare const Dos: DosPlayerFactoryType;

const JSDOS_SCRIPT_SRC = "/js-dos/js-dos.js";

interface PlayerProps {
  dos: Instance | null;
  setDos: Dispatch<SetStateAction<Instance | null>>;
  bundleUrl: string;
}

export default function DosPlayer({ dos, setDos, bundleUrl }: PlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Prevents crash when event runs twice in strict mode
  const scriptLoading = useRef(false);
  useEffect(() => {
    if (rootRef === null || rootRef.current === null || scriptLoading.current) {
      return;
    }

    let instance: Instance | null = null;

    // Function to start a js-dos instance
    const start = () => {
      const root = rootRef.current as HTMLDivElement;
      root.textContent = ""; // Clear
      instance = Dos(root, {
        style: "none",
        noSideBar: true,
        noFullscreen: true,
        noSocialLinks: true,
        clickToStart: false,
      });

      setDos(instance);
    };

    // Check if the script for js-dos exists in the DOM
    const jsDosScript = document.body.querySelector(
      `script[src="${JSDOS_SCRIPT_SRC}"]`,
    );

    if (jsDosScript !== null) {
      start(); // If js-dos is loaded we can just start a new instance normally
    } else {
      // Otherwise, fetch the js-dos script and add it to the DOM to run
      const script = loadAsyncScript(JSDOS_SCRIPT_SRC);
      scriptLoading.current = true;

      // Once the script loads, we can start the instance
      script.addEventListener("load", () => {
        (window as any).emulators.pathPrefix = "/js-dos/";
        start();
        scriptLoading.current = false;
      });
    }

    return () => {
      instance?.stop();
    };
  }, [rootRef, setDos]);

  useEffect(() => {
    if (dos !== null) {
      dos.run(bundleUrl); // ci is returned
    }
  }, [dos, bundleUrl]);

  return (
    <>
      <div ref={rootRef} style={{ width: "100%", height: "100%" }}></div>;
    </>
  );
}
