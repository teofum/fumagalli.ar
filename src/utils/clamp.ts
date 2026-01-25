export default function clamp(value: number, min?: number, max?: number) {
  return Math.max(
    Math.min(value, max ?? Number.MAX_VALUE),
    min ?? -Number.MAX_VALUE,
  );
}
