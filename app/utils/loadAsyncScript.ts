export default function loadAsyncScript(src: string) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);

  return script;
}