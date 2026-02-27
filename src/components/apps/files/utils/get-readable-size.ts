export default function getReadableSize(bytes: number) {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  let exp = 0;
  while (bytes >= 1000) {
    bytes /= 1000;
    exp++;
  }

  return `${bytes.toFixed(0)} ${units[exp]}`;
}
