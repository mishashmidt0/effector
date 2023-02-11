import { MouseEvent } from 'react';

import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import shuffle from 'lodash/shuffle';

export interface Tube {
  balls: BallColor[];
}

export type BallColor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

const COLORS_IN_GAME = 4;
const BALLS_IN_TUBE = 4;
const getCountOfTubes = (colors: number) => colors + 2;

export const restartClicked = createEvent<MouseEvent<HTMLButtonElement>>();
export const tubeClicked = createEvent<number>();

const tubeSelected = tubeClicked.map((position) => position);

export const $state = createStore<'inGame' | 'won'>('inGame');
export const $moves = createStore<number>(0);

const generateTubesFx = createEffect<{ colorsCount: number }, Tube[]>();

const $tubes = createStore<Tube[]>([]);
const $currentSelectedTubeIndex = createStore<number | null>(null);

export const $field = combine($tubes, $currentSelectedTubeIndex, (tubes, selectedIndex) =>
  tubes.map(({ balls }, index) => {
    const isCurrent = selectedIndex === index;
    const over = isCurrent ? balls.at(0)! : null;

    const leftBalls = isCurrent ? balls.slice(1) : balls;

    return { balls: leftBalls, over };
  })
);

sample({
  clock: [restartClicked],
  fn: () => ({ colorsCount: COLORS_IN_GAME }),
  target: generateTubesFx,
});

generateTubesFx.use(({ colorsCount }) => {
  const tubesCount = getCountOfTubes(colorsCount);
  const availableBalls = shuffle(
    Array.from({ length: BALLS_IN_TUBE * colorsCount }, (_, index) => (index % BALLS_IN_TUBE) as BallColor)
  );

  const filledTubes = Array.from({ length: colorsCount }).map(() => ({
    balls: Array.from({ length: BALLS_IN_TUBE }).map(() => availableBalls.pop()!),
  }));

  const emptyTubes = Array.from({ length: tubesCount - colorsCount }, () => ({ balls: [] }));

  return [...filledTubes, ...emptyTubes];
});

$tubes.on(generateTubesFx.doneData, (_, tubes) => tubes);

sample({
  clock: tubeSelected,
  fn: ([tubes, currentTubeIndex], tubeClicked) => {
    if ((tubes as Tube[])[tubeClicked].balls.length === 0) return currentTubeIndex as null | number;

    return tubeClicked === currentTubeIndex ? null : tubeClicked;
  },
  source: [$tubes, $currentSelectedTubeIndex],

  target: $currentSelectedTubeIndex,
});
