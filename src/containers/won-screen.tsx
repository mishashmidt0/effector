import { Button } from '@/ui/button';

export const WonScreen = () => (
  <div className='fixed top-0 right-0 flex h-full w-full flex-col items-center justify-center bg-lime-100/20'>
    <h1>Ты Победил!</h1>
    <Button size='xs'>НОВАЯ ИГРА</Button>
  </div>
);
