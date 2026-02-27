import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

// Code from Radix UI
// https://github.com/radix-ui/primitives/blob/main/packages/react/use-callback-ref/src/useCallbackRef.tsx
// https://github.com/radix-ui/primitives/blob/main/packages/react/scroll-area/src/ScrollArea.tsx#L985

/**
 * A custom hook that converts a callback to a ref to avoid triggering
 * re-renders when passed as a prop or avoid re-executing effects when passed
 * as a dependency
 */
function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined,
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  // https://github.com/facebook/react/issues/19240
  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}

export { useCallbackRef };

export default function useResizeObserver(
  element: HTMLElement | null,
  onResize: () => void,
) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect(() => {
    let rAF = 0;
    if (element) {
      /**
       * Resize Observer will throw an often benign error that says
       * `ResizeObserver loop completed with undelivered notifications`. This
       * means that ResizeObserver was not able to deliver all observations
       * within a single animation frame, so we use `requestAnimationFrame`
       * to ensure we don't deliver unnecessary observations.
       * Further reading: https://github.com/WICG/resize-observer/issues/38
       */
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
