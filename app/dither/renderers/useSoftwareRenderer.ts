import { useCallback, useMemo, useRef } from 'react';
import type { Palette } from '../palettes/types';
import softwareRenderProcess from '../software';
import { getPaletteSize } from '../utils/paletteColors';
import RenderWorker, { type ImagePart } from '../software/RenderWorker';

export const THREADS_AVAILABLE = navigator.hardwareConcurrency;
export const THREADS_AUTO_MAX = Math.max(~~(THREADS_AVAILABLE / 2), 1);

export default function useSoftwareRenderer(
  rt: HTMLCanvasElement | null,
  img: HTMLImageElement | null,
  process: keyof typeof softwareRenderProcess,
  palette: Palette,
  settings: { [key: string]: number | string },
) {
  const activeWorkers = useRef<RenderWorker[]>([]);
  const control = useRef<{ stop: () => void }>({ stop: () => {} });

  const ctx = useMemo(() => rt?.getContext('2d') ?? null, [rt]);

  const render = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!img || !rt || !ctx) return;

      const workers = activeWorkers.current;

      const temp = document.createElement('canvas');
      temp.width = rt.width;
      temp.height = rt.height;

      const ctxTemp = temp.getContext('2d', { willReadFrequently: true });
      if (!ctxTemp) throw new Error('Unable to get temp context');

      ctxTemp.drawImage(img, 0, 0, rt.width, rt.height);

      const renderProcess = softwareRenderProcess[process];

      // Set the number of threads to use
      let nThreads: number;
      if (!renderProcess.supports.threads) nThreads = 1;
      else if (!settings.threads) {
        // Calculate the number of threads needed based on
        // process complexity and image size
        const cr = renderProcess.complexity(getPaletteSize(palette));
        const size = rt.width * rt.height;

        // Assign roughly one thread per 50k pixels for a complexity rating of 2048
        // CR=2048 is a 64 color palette at O(n²/2) or 8 color palette at O(n²/2 * 64)
        const wantThreads = ~~(((size / 50000) * cr) / 2048) + 1;

        // Need at least one thread, limit to max auto threads (half the available threads)
        nThreads =
          wantThreads > THREADS_AUTO_MAX ? THREADS_AUTO_MAX : wantThreads;

        console.log(
          `Want ${wantThreads} threads for ${size}px @CR${cr}, got ${nThreads} (max ${THREADS_AUTO_MAX})`,
        );
      } else nThreads = Number(settings.threads ?? 1);
      let activeThreads: number = 0;

      // Ensure part width is a multiple of 8, prevents dithering seams
      const partWidth = ~~(rt.width / nThreads / 8) * 8;
      // Account for the last few pixels that may have been lost in rounding
      const error = rt.width - partWidth * nThreads;

      const startTime = new Date().getTime();
      for (let t = 0; t < nThreads; t++) {
        const err8 = ~~(error / 8);
        const x = t * partWidth + 8 * (err8 < t ? err8 : t);
        const w =
          partWidth + (t === nThreads - 1 ? error % 8 : err8 > t ? 8 : 0);
        const partData = ctxTemp.getImageData(x, 0, w, rt.height);
        if (!partData) reject('Unable to get image data from context');

        const part: ImagePart = { data: partData, x: x, y: 0 };
        const worker = new RenderWorker();

        worker.onprogress = (progress) => {
          const line = progress.current / (w * 4);

          if (progress.partial) ctx.putImageData(progress.partial.data, x, 0);

          ctx.fillStyle = '#ff00ff';
          ctx.fillRect(x, line, w, 2);
        };

        // eslint-disable-next-line no-loop-func
        worker.onfinish = (result) => {
          ctx.putImageData(result.data, x, 0);

          activeThreads--;
          workers.splice(workers.indexOf(worker), 1);

          const endTime = new Date().getTime();
          console.log(
            `Worker thread ${t + 1} done in ${endTime - startTime}ms`,
          );

          if (activeThreads === 0) {
            console.log(
              `${nThreads} worker threads done in ${endTime - startTime}ms`,
            );
            resolve();
          }
        };

        worker.onerror = (error) => reject(`Error in worker thread: ${error}`);

        console.log(`Starting worker thread ${t + 1}/${nThreads} w=${w}`);
        worker.start(part, process, palette, settings);
        activeThreads++;
        workers.push(worker);
      }

      if (control.current)
        control.current.stop = () =>
          workers.forEach((worker) => worker.terminate());
    });
  }, [img, rt, ctx, palette, process, settings]);

  return { render, stop: control.current.stop };
}
