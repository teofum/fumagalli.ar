import { useEffect, useRef } from "react";

import { useAppState, useWindow } from "@/components/desktop/Window/context";

import {
  previewSupportedFileTypes,
  type PreviewSupportedFile,
  isPreviewable,
} from "./types";
import PreviewRichText from "./modes/PreviewRichText";
import PreviewMDX from "./modes/PreviewMDX";
import PreviewImage from "./modes/PreviewImage";
import useDesktopStore from "@/stores/desktop";
import Menu from "@/components/ui/Menu";
import { files } from "../Files";
// import { useFetcher } from "@remix-run/react";

const getPreviewMode = (fileType: PreviewSupportedFile["_type"]) => {
  switch (fileType) {
    case "fileRichText":
      return PreviewRichText;
    case "fileMDX":
      return PreviewMDX;
    case "fileImage":
      return PreviewImage;
  }
};

export default function Preview() {
  const { id, close, modal } = useWindow();
  const { setTitle } = useDesktopStore();

  const [state, setState] = useAppState("preview");

  // const { load, data, state: fetchState } = useFetcher<PreviewSupportedFile>();

  /**
   * Initialization, load file contents and set window title
   */
  const openFileId = useRef("");
  // useEffect(() => {
  //   if (!state.fileStub || state.fileStub._id === openFileId.current) return;
  //   setTitle(id, `${state.fileStub.name} - Preview`);
  //   load(`/api/file?id=${state.fileStub._id}`);
  // }, [setTitle, setState, id, state.fileStub, load]);

  // useEffect(() => {
  //   if (!data || data._id === openFileId.current) return;
  //   openFileId.current = data._id;

  //   setState({ file: data });
  // }, [data, setState, state.file]);

  // if (fetchState === "loading")
  //   return (
  //     <div className="flex flex-col items-center justify-center gap-0.5 min-w-0">
  //       Starting...
  //     </div>
  //   );

  if (!state.file) return null;

  const open = () => {
    modal(
      files({
        typeFilter: previewSupportedFileTypes,
        modalCallback: (stub) => {
          if (isPreviewable(stub)) setState({ fileStub: stub });
        },
      }),
    );
  };

  const Component = getPreviewMode(state.file._type);
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <Component
        commonMenu={
          <Menu.Menu trigger={<Menu.Trigger>File</Menu.Trigger>}>
            <Menu.Item label="Open..." onSelect={open} />

            <Menu.Separator />

            <Menu.Item label="Close" onSelect={close} />
          </Menu.Menu>
        }
      />
    </div>
  );
}
