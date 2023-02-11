import Link from 'next/link';

import { useEvent, useList, useUnit } from 'effector-react/scope';

import { Tube } from '@/containers/tube/tube';
import { WonScreen } from '@/containers/won-screen';
import { $field, $state, restartClicked, tubeClicked } from '@/store/game-balls';
import { Button } from '@/ui/button';

const $isWon = $state.map((state) => state === 'won');

export default function Page() {
  const isWon = useUnit($isWon);
  const tubeClickedEvent = useEvent(tubeClicked);
  const restartClickedEvent = useEvent(restartClicked);
  const tubes = useList($field, ({ balls, over }, index) => (
    <Tube position={index} tube={{ balls, complete: false, over }} onClick={() => tubeClickedEvent(index)} />
  ));

  return (
    <main className=' flex min-h-[100vh] flex-col items-center justify-center bg-indigo-800'>
      <div className='mb-16 flex gap-2'>
        <Link href='/'>
          <Button>Назад</Button>
        </Link>

        <Button onClick={restartClickedEvent}>Перезапустить</Button>
      </div>

      <div className='grid grid-cols-6 gap-4'>{tubes}</div>
      {isWon && <WonScreen />}
    </main>
  );
}
