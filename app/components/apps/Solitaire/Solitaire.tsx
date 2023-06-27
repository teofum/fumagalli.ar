import { forwardRef, useReducer } from 'react';
import Menu from '~/components/ui/Menu';
import { getAppResourcesUrl } from '~/content/utils';
import solitaireReducer from './reducer';
import { deal } from './game';
import type { Card as CardType } from './types';

const resources = getAppResourcesUrl('solitaire');

type CardProps = CardType & {
  turned?: boolean;
} & Omit<React.ComponentProps<'img'>, 'src'>;

const Card = forwardRef<HTMLImageElement, CardProps>(function Card(
  { suit, number, turned, alt, ...props },
  ref,
) {
  const backSrc = `${resources}/back0.png`;
  const frontSrc = `${resources}/card-${suit}-${number}.png`;
  return (
    <img ref={ref} src={turned ? frontSrc : backSrc} alt={alt} {...props} />
  );
});

export default function Solitaire() {
  const [{ deck, drawn, stacks, rows }, dispatch] = useReducer(
    solitaireReducer,
    deal(),
  );

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-row gap-0.5">
        <Menu.Root trigger={<Menu.Trigger>Game</Menu.Trigger>}>
          <Menu.Item label="Deal" onSelect={() => dispatch({ type: 'deal' })} />
        </Menu.Root>
      </div>

      <div className="flex-1 bg-[#008000] bevel-content p-2">
        <div className="grid grid-cols-7 grid-rows-[auto_1fr] justify-items-center gap-2 mx-2">
          {/* Deck */}
          <div className="relative">
            <button
              className="cursor-default select-none"
              onClick={() => dispatch({ type: 'undraw' })}
            >
              <img src={`${resources}/deck-empty.png`} alt="" />
            </button>

            {deck.map((card, i) => {
              const height = Math.floor(i / 10);

              return (
                <button
                  key={`${card.suit}-${card.number}`}
                  className="absolute top-0 left-0 cursor-default select-none"
                  style={{
                    transform: `translate(${height * 2}px, ${height}px)`,
                  }}
                  onClick={() => dispatch({ type: 'draw' })}
                >
                  <Card suit={card.suit} number={card.number} />
                </button>
              );
            })}
          </div>

          {/* Drawn cards */}
          <div className="relative w-[71px] h-[96px]">
            {drawn.map((card, i) => {
              const height = Math.floor(i / 10);

              return (
                <div
                  key={`${card.suit}-${card.number}`}
                  className="absolute top-0 left-0"
                  style={{
                    transform: `translate(${height * 2}px, ${height}px)`,
                  }}
                >
                  <Card suit={card.suit} number={card.number} turned />
                </div>
              );
            })}
          </div>

          {/* Empty slot */}
          <div />

          {/* Suit stacks */}
          {[0, 1, 2, 3].map((i) => (
            <div key={`suit_${i}`}>
              <img
                src={`${resources}/stack-empty.png`}
                alt={`Suit stack ${i + 1}`}
              />
            </div>
          ))}

          {/* Row stacks */}
          {[0, 1, 2, 3, 4, 5, 6].map((iRow) => (
            <div key={`row_${iRow}`} className="relative w-[71px] h-[96px]">
              {rows[iRow].unturned.map((card, iCard) => {
                const y = iCard * 3;

                return (
                  <div
                    key={`${card.suit}-${card.number}`}
                    className="absolute top-0 left-0"
                    style={{
                      transform: `translateY(${y}px)`,
                    }}
                  >
                    <Card suit={card.suit} number={card.number} />
                  </div>
                );
              })}

              {rows[iRow].turned.map((card, iCard) => {
                const y = iCard * 15 + rows[iRow].unturned.length * 3;

                return (
                  <div
                    key={`${card.suit}-${card.number}`}
                    className="absolute top-0 left-0"
                    style={{
                      transform: `translateY(${y}px)`,
                    }}
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
