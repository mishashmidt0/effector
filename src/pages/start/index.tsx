import { useEffect } from 'react';
import Link from 'next/link';

import { useEvent, useList, useUnit } from 'effector-react/scope';

import { Tube } from '@/containers/tube/tube';
import { WonScreen } from '@/containers/won-screen';
import {
  $field,
  $moves,
  $state,
  restartClicked,
  start,
  tubeClicked,
} from '@/store/game-balls';
import { Button } from '@/ui/button';

const $isWon = $state.map((state) => state === 'won');

export default function Page() {
  const isWon = useUnit($isWon);
  const moves = useUnit($moves);
  const tubeClickedEvent = useEvent(tubeClicked);
  const restartClickedEvent = useEvent(restartClicked);
  const startEvent = useEvent(start);
  const tubes = useList($field, ({ balls, over, complete }, index) => (
    <Tube
      position={index}
      tube={{ balls, complete, over }}
      onClick={() => tubeClickedEvent(index)}
    />
  ));

  useEffect(() => {
    startEvent();
  }, []);

  return (
    <main className=' flex min-h-[100vh] flex-col items-center justify-center bg-indigo-800 text-white'>
      <div className='mb-16 flex gap-2'>
        <Link href='/'>
          <Button>Назад</Button>
        </Link>

        <Button onClick={restartClickedEvent}>Перезапустить</Button>

        <p className='text-lg font-medium'>Шаги: {moves}</p>
      </div>

      <div className='grid min-h-[220px] grid-cols-6 gap-4'>{tubes}</div>
      {isWon && <WonScreen />}
    </main>
  );
}
