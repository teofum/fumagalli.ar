import { forwardRef, useEffect, useReducer, useRef } from 'react';
import Menu from '~/components/ui/Menu';
import { getAppResourcesUrl } from '~/content/utils';
import solitaireReducer from './reducer';
import { deal } from './game';
import type { Card as CardType } from './types';
import useDrag from '~/hooks/useDrag';
import cn from 'classnames';

const resources = getAppResourcesUrl('solitaire');

type CardProps = CardType & {
  turned?: boolean;
} & Omit<React.ComponentProps<'img'>, 'src'>;

const Card = forwardRef<HTMLImageElement, CardProps>(function Card(
  { suit, number, turned, alt, className, ...props },
  ref,
) {
  const backSrc = `${resources}/back0.png`;
  const frontSrc = `${resources}/card-${suit}-${number}.png`;
  return (
    <img
      ref={ref}
      src={turned ? frontSrc : backSrc}
      alt={alt}
      className={cn('pointer-events-none', className)}
      {...props}
    />
  );
});

export default function Solitaire() {
  const [{ deck, drawn, stacks, rows, state }, dispatch] = useReducer(
    solitaireReducer,
    deal(),
  );

  /**
   * Card drag handlers
   */
  const onDragStart = (ev: PointerEvent, target: EventTarget | null) => {
    const el = target as HTMLElement;

    // Get drag target and all its siblings (cards on top in the stack)
    const siblings = [el];
    while (siblings.at(-1)?.nextElementSibling) {
      const next = siblings.at(-1)?.nextElementSibling as HTMLElement;
      siblings.push(next);
    }

    siblings.forEach((el) => {
      // Calculate offset from mouse (or finger)
      const { x, y } = el.getBoundingClientRect();
      const offsetX = x - ev.clientX;
      const offsetY = y - ev.clientY;

      // Save offset to DOM data attributes temporarily
      el.dataset.offsetX = offsetX.toString();
      el.dataset.offsetY = offsetY.toString();

      // Set position: fixed in element styles
      el.style.setProperty('position', 'fixed');
      el.style.setProperty('top', `${y}px`);
      el.style.setProperty('left', `${x}px`);
      el.style.setProperty('z-index', '9999'); // Make sure it's on top

      // Save the transform in dataset and remove it to avoid shift
      el.dataset.transform = el.style.transform;
      el.style.removeProperty('transform');

      // Set pointer-events: none, so the drag-end event's target is whichever
      // element we happen to drop the card on top of
      el.style.setProperty('pointer-events', 'none');
    });
  };

  const onDragMove = (ev: PointerEvent, target: EventTarget | null) => {
    const el = target as HTMLElement;

    // Get drag target and all its siblings (cards on top in the stack)
    const siblings = [el];
    while (siblings.at(-1)?.nextElementSibling) {
      const next = siblings.at(-1)?.nextElementSibling as HTMLElement;
      siblings.push(next);
    }

    siblings.forEach((el) => {
      // Calculate new window position from cursor + offset
      const offsetX = Number(el.dataset.offsetX || '0');
      const offsetY = Number(el.dataset.offsetY || '0');
      const newX = ev.clientX + offsetX;
      const newY = ev.clientY + offsetY;

      el.style.setProperty('top', `${~~newY}px`);
      el.style.setProperty('left', `${~~newX}px`);
    });
  };

  const onDragEnd = (ev: PointerEvent, target: EventTarget | null) => {
    const el = target as HTMLElement;

    // Get drag target and all its siblings (cards on top in the stack)
    const siblings = [el];
    while (siblings.at(-1)?.nextElementSibling) {
      const next = siblings.at(-1)?.nextElementSibling as HTMLElement;
      siblings.push(next);
    }

    siblings.forEach((el) => {
      // Drag ended, remove style attributes
      el.style.removeProperty('position');
      el.style.removeProperty('top');
      el.style.removeProperty('left');
      el.style.removeProperty('z-index');
      el.style.removeProperty('pointer-events');

      // Put the transform back
      el.style.setProperty('transform', el.dataset.transform ?? '');
      delete el.dataset.transform;

      // Reset offset data attributes
      delete el.dataset.offsetX;
      delete el.dataset.offsetY;
    });

    // Now apply the actual game logic
    // First, find out where the card was dropped
    const dropTarget = ev.target as HTMLElement | null;
    const dropId = dropTarget?.id;
    const parentId = dropTarget?.parentElement?.id;

    // We only care about two possibilities: a suit stack, or a row stack
    // Might be dropping on a stack directly, or on a child element
    const match =
      dropId?.match(/^stack-(suit|row)-(\d+)$/) ??
      parentId?.match(/^stack-(suit|row)-(\d+)$/);
    if (match) {
      // Figure out which card this even is
      const cards = siblings
        .map((el) => el.id.split('-'))
        .map(
          ([suit, cardNumber]) =>
            ({ suit, number: Number(cardNumber) } as CardType),
        );

      const [, type, stackNumber] = match;
      const index = Number(stackNumber);

      // Dispatch the move event
      dispatch({
        type: 'move',
        cards,
        to: { type: type as 'suit' | 'row', index },
      });
    }
  };

  const cardDragHandler = useDrag({ onDragStart, onDragMove, onDragEnd });

  /**
   * Win animation
   */
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === 'won' && boardRef.current) {
      let i = 51;
      const board = boardRef.current;

      let vx = 0;
      let vy = 0;
      let x = 0;
      let y = 0;
      let z = 0;
      let raf: { x: number | null} = { x: null };

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

        if (i > 0) raf.x = requestAnimationFrame(animate);
      };

      animate();
      return () => {
        if (raf.x !== null) cancelAnimationFrame(raf.x);
      }
    }
  }, [state]);

  /**
   * Component UI
   */
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-row gap-0.5">
        <Menu.Root trigger={<Menu.Trigger>Game</Menu.Trigger>}>
          <Menu.Item label="Deal" onSelect={() => dispatch({ type: 'deal' })} />
        </Menu.Root>
      </div>

      <div
        ref={boardRef}
        className={cn('flex-1 bg-[#008000] bevel-content select-none p-0.5', {
          'pointer-events-none': state === 'won',
        })}
      >
        <div
          className={cn(
            'grid grid-cols-7 grid-rows-[auto_1fr] justify-items-center',
            'gap-1 px-4 py-2 min-h-full overflow-hidden',
          )}
        >
          {/* Deck */}
          <div className="relative">
            <button
              className="cursor-default"
              onClick={() => dispatch({ type: 'undraw' })}
            >
              <img src={`${resources}/deck-empty.png`} alt="" />
            </button>

            {deck.map((card, i) => {
              const height = Math.floor(i / 10);

              return (
                <div
                  key={`${card.suit}-${card.number}`}
                  className="absolute top-0 left-0"
                  style={{
                    transform: `translate(${height * 2}px, ${height}px)`,
                  }}
                  onClick={() => dispatch({ type: 'draw' })}
                >
                  <Card suit={card.suit} number={card.number} />
                </div>
              );
            })}
          </div>

          {/* Drawn cards */}
          <div className="relative w-[71px] h-[96px]">
            {drawn.map((card, i, { length }) => {
              const height = Math.floor(i / 10);
              const top = i === length - 1;

              return (
                <div
                  key={`${card.suit}-${card.number}`}
                  id={`${card.suit}-${card.number}`}
                  className="absolute top-0 left-0"
                  style={{
                    transform: `translate(${height * 2}px, ${height}px)`,
                  }}
                  onPointerDown={top ? cardDragHandler : undefined}
                  onDoubleClick={
                    top
                      ? () => dispatch({ type: 'sendToStack', card })
                      : undefined
                  }
                >
                  <Card suit={card.suit} number={card.number} turned />
                </div>
              );
            })}
          </div>

          {/* Empty slot */}
          <div />

          {/* Suit stacks */}
          {[0, 1, 2, 3].map((iStack) => (
            <div
              key={`suit_${iStack}`}
              id={`stack-suit-${iStack}`}
              className="relative"
            >
              <img
                src={`${resources}/stack-empty.png`}
                alt={`Suit stack ${iStack + 1}`}
              />

              {stacks[iStack].map((card, iCard, { length }) => {
                const height = Math.floor(iCard / 4);
                // const top = iCard === length - 1;

                return (
                  <div
                    key={`${card.suit}-${card.number}`}
                    id={`${card.suit}-${card.number}`}
                    className="absolute top-0 left-0"
                    style={{
                      transform: `translate(${height * 2}px, ${height}px)`,
                    }}
                    onPointerDown={top ? cardDragHandler : undefined}
                  >
                    <Card suit={card.suit} number={card.number} turned />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Row stacks */}
          {[0, 1, 2, 3, 4, 5, 6].map((iRow) => (
            <div
              key={`row_${iRow}`}
              id={`stack-row-${iRow}`}
              className="relative w-[71px] h-[96px]"
            >
              {rows[iRow].unturned.map((card, iCard, { length }) => {
                const y = iCard * 3;
                const top = iCard === length - 1;

                return (
                  <div
                    key={`${card.suit}-${card.number}`}
                    className="absolute top-0 left-0"
                    style={{
                      transform: `translateY(${y}px)`,
                    }}
                    onPointerDown={
                      top
                        ? () => dispatch({ type: 'reveal', rowIndex: iRow })
                        : undefined
                    }
                  >
                    <Card suit={card.suit} number={card.number} />
                  </div>
                );
              })}

              {rows[iRow].turned.map((card, iCard, { length }) => {
                const y = iCard * 15 + rows[iRow].unturned.length * 3;
                const top = iCard === length - 1;

                return (
                  <div
                    key={`${card.suit}-${card.number}`}
                    id={`${card.suit}-${card.number}`}
                    className="absolute top-0 left-0"
                    style={{
                      transform: `translateY(${y}px)`,
                    }}
                    onPointerDown={cardDragHandler}
                    onDoubleClick={
                      top
                        ? () => dispatch({ type: 'sendToStack', card })
                        : undefined
                    }
                  >
                    <Card suit={card.suit} number={card.number} turned />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
