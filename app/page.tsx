'use client';

import { AnimatePresence } from 'framer-motion';
import { useTearStore } from '@/lib/store';
import TearCanvas from '@/components/canvas/TearCanvas';
import IntroBottle from '@/components/bottle/IntroBottle';
import MiniBottle from '@/components/bottle/MiniBottle';
import SortBar from '@/components/ui/SortBar';
import Legend from '@/components/ui/Legend';
import AddPanel from '@/components/form/AddPanel';

export default function Home() {
  const { introduced, formOpen } = useTearStore();

  return (
    <>
      <AnimatePresence>
        {!introduced && <IntroBottle key="intro" />}
      </AnimatePresence>

      {introduced && <TearCanvas />}

      <SortBar />
      <Legend />
      <MiniBottle />

      <AnimatePresence>
        {formOpen && <AddPanel key="panel" />}
      </AnimatePresence>
    </>
  );
}
