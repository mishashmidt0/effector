import { useEvent, useUnit } from 'effector-react/scope';

import { $moves, newGameClicked } from '@/store/game-balls';
import { Button } from '@/ui/button';

export const WonScreen = () => {
  const newGameEvent = useEvent(newGameClicked);
  const moves = useUnit($moves);

  return (
    <div className='fixed top-0 right-0 flex h-full w-full flex-col items-center bg-indigo-900/80'>
      <div className='mt-20 text-center'>
        <h1 className='mb-4 text-xl font-bold'>Ты Победил!</h1>
        <h2 className='mb-4 text-lg font-bold'>Количество шагов: {moves}</h2>
        <Button size='xs' onClick={newGameEvent}>
          НОВАЯ ИГРА
        </Button>
      </div>
    </div>
  );
};
