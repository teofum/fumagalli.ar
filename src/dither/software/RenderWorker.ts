import type softwareRenderProcess from '.';
import type { Palette } from '../palettes/types';

enum RenderEvent {
  Progress,
  Done,
  Error,
}

interface RenderWorkerMsg {
  msg: RenderEvent;
  params: any;
}

export interface ImagePart {
  data: ImageData;
  x: number;
  y: number;
}

// Wraps the render worker and abstracts the messages
export default class RenderWorker {
  private worker: Worker;
  private busy: boolean = false;
  private x: number = 0;
  private y: number = 0;

  public onprogress:
    | ((progress: {
        current: number;
        total: number;
        partial?: ImagePart;
      }) => void)
    | undefined;
  public onfinish: ((result: ImagePart) => void) | undefined;
  public onerror: ((message: string) => void) | undefined;

  public get ready(): boolean {
    return !this.busy;
  }

  constructor() {
    this.worker = new Worker('/workers/worker.js');

    this.worker.onmessage = (ev: MessageEvent) => {
      const msg = ev.data as RenderWorkerMsg;
      switch (msg.msg) {
        case RenderEvent.Progress:
          if (this.onprogress)
            this.onprogress({
              ...msg.params,
              partial: msg.params.partial
                ? { data: msg.params.partial, x: this.x, y: this.y }
                : undefined,
            });
          break;

        case RenderEvent.Done:
          if (this.onfinish)
            this.onfinish({
              data: msg.params.result,
              x: this.x,
              y: this.y,
            });
          this.busy = false;
          break;

        case RenderEvent.Error:
          if (this.onerror) this.onerror(msg.params.error);
          this.busy = false;
          break;
      }
    };
  }

  public start(
    part: ImagePart,
    process: keyof typeof softwareRenderProcess,
    palette: Palette,
    settings: { [key: string]: number | string },
  ): boolean {
    if (this.busy) return false;
    this.busy = true;

    this.worker.postMessage({
      dataIn: part.data,
      process,
      palette,
      settings,
    });
    return true;
  }

  public terminate(): void {
    this.worker.terminate();
  }
}
