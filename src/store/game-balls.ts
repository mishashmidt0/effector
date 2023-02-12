import { MouseEvent } from 'react';

import { combine, createEffect, createEvent, createStore, guard, sample } from 'effector';
import shuffle from 'lodash/shuffle';
export interface Tube {
  balls: BallColor[];
}

export type BallColor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

const COLORS_IN_GAME = 4;
const BALLS_IN_TUBE = 4;
const getCountOfTubes = (colors: number) => colors + 2;

export const restartClicked = createEvent<MouseEvent<HTMLButtonElement>>();
export const newGameClicked = createEvent<MouseEvent<HTMLButtonElement>>();
export const start = createEvent();
export const tubeClicked = createEvent<number>();
const gameFinishedSuccessfully = createEvent();
const tubeSelected = tubeClicked.map((position) => position);

export const $state = createStore<'inGame' | 'won'>('inGame');
export const $moves = createStore<number>(0);

const generateTubesFx = createEffect<{ colorsCount: number }, Tube[]>();

const $tubes = createStore<Tube[]>([]);
const $currentSelectedTubeIndex = createStore<number | null>(null);

$state.on(newGameClicked, () => 'inGame');

export const $field = combine($tubes, $currentSelectedTubeIndex, (tubes, selectedIndex) =>
  tubes.map((tube, index) => {
    const { balls } = tube;
    const isCurrent = selectedIndex === index;
    const over = isCurrent ? balls.at(0)! : null;

    const leftBalls = isCurrent ? balls.slice(1) : balls;

    return { balls: leftBalls, complete: isComplete(tube), over };
  })
);

const $filledTubesCount = $field.map(
  (tubes) => tubes.filter(({ complete }) => complete).length
);

function isComplete(tube: Tube): boolean {
  if (tube.balls.length === BALLS_IN_TUBE) {
    const firstBall = tube.balls.at(0);

    return tube.balls.every((ball) => ball === firstBall);
  }

  return false;
}

sample({
  clock: [restartClicked, newGameClicked, start],
  fn: () => ({ colorsCount: COLORS_IN_GAME }),
  target: generateTubesFx,
});

generateTubesFx.use(({ colorsCount }) => {
  const tubesCount = getCountOfTubes(colorsCount);
  const availableBalls = shuffle(
    Array.from(
      { length: BALLS_IN_TUBE * colorsCount },
      (_, index) => (index % BALLS_IN_TUBE) as BallColor
    )
  );

  const filledTubes = Array.from({ length: colorsCount }).map(() => ({
    balls: Array.from({ length: BALLS_IN_TUBE }).map(() => availableBalls.pop()!),
  }));

  const emptyTubes = Array.from({ length: tubesCount - colorsCount }, () => ({
    balls: [],
  }));

  return [...filledTubes, ...emptyTubes];
});

$tubes.on(generateTubesFx.doneData, (_, tubes) => tubes);

const tubeWillChange = sample({
  clock: tubeSelected,
  fn: ([tubes, currenIndex], selectedIndex) => ({ currenIndex, selectedIndex, tubes }),
  source: [$tubes, $currentSelectedTubeIndex],
});

const ballUplift = guard({
  filter: ({ tubes, currenIndex, selectedIndex }) =>
    currenIndex === null && (tubes as Tube[])[selectedIndex].balls.length !== 0,
  source: tubeWillChange,
});

$currentSelectedTubeIndex.on(ballUplift, (_, { selectedIndex }) => selectedIndex);

const ballDownLiftBack = guard({
  filter: ({ currenIndex, selectedIndex }) => currenIndex === selectedIndex,
  source: tubeWillChange,
});

$currentSelectedTubeIndex.on(ballDownLiftBack, () => null);

const ballMoved = guard({
  filter: ({ tubes, currenIndex, selectedIndex }) => {
    if (currenIndex === null) return false;
    if (currenIndex === selectedIndex) return false;
    const sourceTube = (tubes as Tube[])[currenIndex as number];
    const targetTube = (tubes as Tube[])[selectedIndex];

    const sourceBall = sourceTube.balls.at(0);
    const targetBall = targetTube.balls.at(0);

    const isTargetTubeEmpty = targetBall === undefined;

    return isTargetTubeEmpty ? true : sourceBall === targetBall;
  },
  source: tubeWillChange,
});

$tubes.on(ballMoved, (_, { tubes, currenIndex, selectedIndex }) => {
  const sourceBall = (tubes as Tube[])[currenIndex as number].balls.at(0)!;

  return (tubes as Tube[]).map((tube, index) => {
    if (index === currenIndex) return { balls: tube.balls.slice(1) };

    if (index === selectedIndex) return { balls: [sourceBall, ...tube.balls] };

    return tube;
  });
});

guard({
  filter: (filled) => filled === COLORS_IN_GAME,
  source: $filledTubesCount,
  target: gameFinishedSuccessfully,
});

$moves.on(ballMoved, (count) => count + 1);
$currentSelectedTubeIndex.on(ballMoved, () => null);

const clearState = sample({
  clock: [restartClicked, newGameClicked],
});

$currentSelectedTubeIndex.reset(clearState);
$moves.reset(clearState);

$state.on(gameFinishedSuccessfully, () => 'won');
// debug(ballUplift, ballDownLiftBack, ballMoved);
