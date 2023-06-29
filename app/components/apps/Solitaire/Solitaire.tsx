import { forwardRef, useEffect, useReducer, useRef, useState } from 'react';
import cn from 'classnames';

import { useWindow } from '~/components/desktop/Window/context';
import useDesktopStore from '~/stores/desktop';
import Button from '~/components/ui/Button';
import Menu from '~/components/ui/Menu';

import { getAppResourcesUrl } from '~/content/utils';

import type { Card as CardType } from './types';
import solitaireReducer from './reducer';
import { deal } from './game';
import useDragCard from './useDragCard';
import winAnimation from './animation';
import { useAppSettings } from '~/stores/system';

const resources = getAppResourcesUrl('solitaire');

type CardProps = CardType & {
  turned?: boolean;
  back: number;
  animate?: boolean;
} & Omit<React.ComponentProps<'img'>, 'src'>;

const Card = forwardRef<HTMLImageElement, CardProps>(function Card(
  { suit, number, turned, alt, className, back, animate = false, ...props },
  ref,
) {
  const animated = animate && (back === 6 || back === 9);

  const backSrc = `${resources}/back${back}.${animated ? 'gif' : 'png'}`;
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
  const { close } = useDesktopStore();
  const { id } = useWindow();

  const [settings, set] = useAppSettings('solitaire');
  const [game, dispatch] = useReducer(solitaireReducer, deal());

  /**
   * Sync game-state settings with app settings from system store
   * The game reducer needs to be aware of settings for scoring and drawing
   * We could pass settings with each action instead, but that gets tedious and
   * pollutes the API...
   */
  useEffect(() => {
    dispatch({ type: 'deal', settings });
  }, [settings]);

  /**
   * Timer
   */
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (game.state !== 'playing' && timer) {
      // Stop timer on gamestate change
      clearInterval(timer);
      setTimer(undefined);
    }
  }, [game.state, timer]);

  const resetTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(undefined);
    }

    setTime(0);
  };

  const startTimer = () => {
    if (timer) return;

    setTime(0);
    const newTimer = setInterval(() => {
      setTime((time) => Math.min(time + 1, 999));
    }, 1000);
    setTimer(newTimer);
  };

  const newGame = (set = settings) => {
    dispatch({ type: 'deal', settings: set });
    resetTimer();
  };

  /**
   * Card drag handlers
   */
  const cardDragHandler = useDragCard(dispatch);

  /**
   * Win animation
   */
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (game.state === 'win_anim' && boardRef.current) {
      const board = boardRef.current;
      return winAnimation(board, () => dispatch({ type: 'endWinAnimation' }));
    }
  }, [game.state]);

  /**
   * Component UI
   */
  return (
    <div className="flex flex-col gap-0.5">
      {/* Menu bar */}
      <div className="flex flex-row gap-0.5">
        <Menu.Root trigger={<Menu.Trigger>Game</Menu.Trigger>}>
          <Menu.Item label="Deal" onSelect={() => newGame()} />

          <Menu.Separator />

          <Menu.Sub label="Rules">
            <Menu.RadioGroup
              value={settings.rules}
              onValueChange={(value) =>
                set({ ...settings, rules: value as any })
              }
            >
              <Menu.RadioItem value="draw-one" label="Draw one (easy)" />
              <Menu.RadioItem value="draw-three" label="Draw three (hard)" />
            </Menu.RadioGroup>
          </Menu.Sub>

          <Menu.Sub label="Scoring">
            <Menu.RadioGroup
              value={settings.scoring}
              onValueChange={(value) =>
                set({ ...settings, scoring: value as any })
              }
            >
              <Menu.RadioItem value="none" label="No scoring" />
              <Menu.RadioItem value="standard" label="Standard" />
              <Menu.RadioItem value="vegas" label="Vegas" />
            </Menu.RadioGroup>
          </Menu.Sub>

          <Menu.Sub label="Deck">
            <Menu.RadioGroup
              value={settings.back.toString()}
              onValueChange={(value) =>
                set({ ...settings, back: Number(value) })
              }
            >
              <Menu.RadioItem value="0" label="Deck 1" />
              <Menu.RadioItem value="1" label="Deck 2" />
              <Menu.RadioItem value="2" label="Deck 3" />
              <Menu.RadioItem value="3" label="Deck 4" />
              <Menu.RadioItem value="4" label="Deck 5" />
              <Menu.RadioItem value="5" label="Deck 6" />
              <Menu.RadioItem value="6" label="Deck 7" />
              <Menu.RadioItem value="7" label="Deck 8" />
              <Menu.RadioItem value="8" label="Deck 9" />
              <Menu.RadioItem value="9" label="Deck 10" />
              <Menu.RadioItem value="10" label="Deck 11" />
              <Menu.RadioItem value="11" label="Deck 12" />
            </Menu.RadioGroup>
          </Menu.Sub>

          <Menu.Separator />

          <Menu.Item label="Exit" onSelect={() => close(id)} />
        </Menu.Root>
      </div>

      {/* Game board */}
      <div
        ref={boardRef}
        className="flex-1 bg-[#008000] bevel-content select-none p-0.5 relative"
        onClick={
          game.state === 'win_anim'
            ? () => dispatch({ type: 'endWinAnimation' })
            : undefined
        }
      >
        <div
          className={cn(
            'grid grid-cols-7 grid-rows-[auto_1fr] justify-items-center',
            'gap-1 px-4 py-2 min-h-full overflow-hidden',
            { 'pointer-events-none': game.state !== 'playing' },
          )}
          onPointerDown={startTimer}
        >
          {/* Deck */}
          <div className="relative">
            <button
              className="cursor-default"
              onClick={() => dispatch({ type: 'undraw' })}
            >
              <img src={`${resources}/deck-empty.png`} alt="" />
            </button>

            {game.deck.map((card, i) => {
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
                  <Card
                    back={settings.back}
                    suit={card.suit}
                    number={card.number}
                    animate
                  />
                </div>
              );
            })}
          </div>

          {/* Drawn cards */}
          <div className="relative w-[71px] h-[96px]">
            {game.drawn.map((card, i, { length }) => {
              const height = Math.floor(i / 10);
              const top = i === length - 1;

              // Offset last few cards in draw-three
              const offset = Math.max(0, i - (length - 1) + game.drawnOffset);

              const x = height * 2 + offset * 15;
              const y = height + offset;

              return (
                <div
                  key={`${card.suit}-${card.number}`}
                  id={`${card.suit}-${card.number}`}
                  className="absolute top-0 left-0"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  onPointerDown={top ? cardDragHandler : undefined}
                  onDoubleClick={
                    top
                      ? () => dispatch({ type: 'sendToStack', card })
                      : undefined
                  }
                >
                  <Card
                    back={settings.back}
                    suit={card.suit}
                    number={card.number}
                    turned
                  />
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

              {game.stacks[iStack].map((card, iCard, { length }) => {
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
                    <Card
                      back={settings.back}
                      suit={card.suit}
                      number={card.number}
                      turned
                    />
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
              {game.rows[iRow].unturned.map((card, iCard, { length }) => {
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
                    <Card
                      back={settings.back}
                      suit={card.suit}
                      number={card.number}
                    />
                  </div>
                );
              })}

              {game.rows[iRow].turned.map((card, iCard, { length }) => {
                const y = iCard * 15 + game.rows[iRow].unturned.length * 3;
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
                    <Card
                      back={settings.back}
                      suit={card.suit}
                      number={card.number}
                      turned
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Win overlay */}
        {game.state === 'won' ? (
          <div className="absolute inset-0.5 bg-checkered-dark grid place-items-center z-5000">
            <div className="bg-surface bevel-window p-4 flex flex-col items-center gap-2">
              <div>You won. Congratulations!</div>
              <Button className="py-1 px-4" onClick={() => newGame()}>
                Deal again
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Status bar */}
      <div className="flex flex-row gap-0.5">
        <div className="flex-[2] bg-surface bevel-light-inset py-0.5 px-1">
          {settings.rules === 'draw-one' ? 'Draw one' : 'Draw three'} |{' '}
          {settings.scoring === 'none'
            ? 'No'
            : settings.scoring[0].toUpperCase() +
              settings.scoring.substring(1)}{' '}
          scoring
        </div>
        <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1">
          Time: {Math.floor(time / 60)}:
          {(time % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1">
          {settings.scoring === 'none'
            ? 'Scoring disabled'
            : `Score: ${game.score}`}
        </div>
      </div>
    </div>
  );
}
