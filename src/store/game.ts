import { MouseEvent } from 'react';

import { createEvent, createStore, sample } from 'effector';

export interface Tube {
  balls: BallColor[];
}

export type BallColor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

const COLORS_IN_GAME = 4;
const BALLS_IN_TUBE = 4;
const getCountOfTubes = (colors: number) => colors + 2;

export const restartClicked = createEvent<MouseEvent<HTMLButtonElement>>();
export const tubeClicked = createEvent<MouseEvent<HTMLButtonElement>>();

export const $state = createStore<'inGame' | 'won'>('inGame');
export const $moves = createStore<number>(0);

const generateTubes = createEvent<number>();

export const $tubes = createStore<Tube[]>([]);

sample({
  clock: [restartClicked],
  fn: () => getCountOfTubes(COLORS_IN_GAME),
  target: generateTubes,
});

$tubes.on(generateTubes, (_, tubesCount) => Array.from({ length: tubesCount }).map(() => ({ balls: [] })));
