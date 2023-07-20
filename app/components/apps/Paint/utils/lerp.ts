export default function lerp(a: number, b: number, ratio: number) {
  return a * (1 - ratio) + b * ratio;
}