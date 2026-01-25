export default function winAnimation(board: HTMLElement, end: () => void) {
  let i = 51;
  let vx = 0;
  let vy = 0;
  let x = 0;
  let y = 0;
  let z = 0;
  let raf: { x: number | null } = { x: null };

  const animate = () => {
    const iStack = i % 4;
    const iCard = Math.floor(i / 4) + 1;

    const stack = board.querySelector(`#stack-suit-${iStack}`);
    const card = stack?.children.item(iCard) as HTMLDivElement;
    const image = card.firstElementChild as HTMLImageElement;

    const { height, left, right } = board.getBoundingClientRect();

    if (!card.dataset.animated) {
      card.dataset.animated = 'true';
      card.style.setProperty('z-index', `${100 - i}`);
      vx = (Math.random() * 8 + 2) * (Math.random() > 0.5 ? -1 : 1);
      vy = (Math.random() * 6 + 1) * (Math.random() > 0.2 ? -1 : 0.5);
      x = 0;
      y = 0;
      z = 0;
    } else {
      const newEl = image.cloneNode() as HTMLImageElement;
      newEl.style.setProperty('position', 'absolute');
      newEl.style.setProperty('top', `${y}px`);
      newEl.style.setProperty('left', `${x}px`);
      newEl.style.setProperty('z-index', `${z}`);
      card.appendChild(newEl);
      x += vx;
      y += vy;
      z++;

      vy += 1; // Gravity
      if (y > height - 96 && vy > 0) {
        vy *= -0.8; // Bounce!
      }

      const { left: elL, right: elR } = newEl.getBoundingClientRect();
      const outOfBounds = elL > right || elR < left;
      if (outOfBounds) i--;
    }

    if (i >= 0) raf.x = requestAnimationFrame(animate);
    else end();
  };

  animate();
  return () => {
    if (raf.x !== null) cancelAnimationFrame(raf.x);
  };
}
