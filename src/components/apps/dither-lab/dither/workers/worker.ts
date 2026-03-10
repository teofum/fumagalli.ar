import type { Palette } from '../palettes/types';
import type { ProgressFn } from '../software/types';
import softwareRenderProcess from '../software';
import { initGammaLUT } from '../utils/gamma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

interface ProcWorkerStartArgs {
  dataIn: ImageData;
  process: keyof typeof softwareRenderProcess;
  palette: Palette;
  settings: { [key: string]: number | string };
}

enum ProcessEvent {
  Progress,
  Done,
  Error,
}

const reportProgress: ProgressFn = (
  current: number,
  total: number,
  partial?: ImageData,
) => {
  ctx.postMessage({
    msg: ProcessEvent.Progress,
    params: { current, total, partial },
  });
};

ctx.addEventListener('message', (ev: MessageEvent) => {
  const msg = ev.data as ProcWorkerStartArgs;
  const { process: procName, palette, settings } = msg;

  // Convert image using the passed process
  const process = softwareRenderProcess[procName];

  if (!process) {
    ctx.postMessage({
      msg: ProcessEvent.Error,
      params: { error: `WorkerInit failed: process ${procName} not found` },
    });
    self.close();
    return;
  }

  initGammaLUT(Number(settings.gamma ?? 2.2));

  process.run(msg.dataIn, palette, settings, reportProgress);
  ctx.postMessage({ msg: ProcessEvent.Done, params: { result: msg.dataIn } });
  self.close();
});
