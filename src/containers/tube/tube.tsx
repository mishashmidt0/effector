import React from 'react';

import cc from 'classcat';

import { colors } from '@/constants/color';
import { BallColor } from '@/store/game-balls';

type TubeProps = {
  onClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
  position: number;
  tube: {
    balls: Array<BallColor>;
    complete: boolean;
    over: BallColor | null;
  };
};

export const Tube = ({ tube, position, onClick }: TubeProps) => (
  <button className='relative' data-position={position} onClick={onClick}>
    <div className='absolute top-[-58px] left-2 mb-1 flex justify-center'>
      {tube.over === null ? null : <Ball ball={tube.over} />}
    </div>

    <div
      data-complete={tube.complete}
      className={cc([
        'flex h-full flex-col justify-end gap-1 rounded-b-3xl border-2  border-solid border-white p-2',
        { '!border-black bg-white': tube.complete },
      ])}
    >
      {tube.balls.map((color, index) => (
        <Ball key={index} ball={color} />
      ))}
    </div>
  </button>
);

const Ball = ({ ball }: { ball: BallColor | null }) => (
  <div
    className={cc([
      `h-12 w-12 rounded-full border-2 border-solid border-black ${
        ball || ball === 0 ? colors[ball] : ''
      }`,
    ])}
  ></div>
);
