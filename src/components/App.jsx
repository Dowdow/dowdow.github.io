import React, { Suspense, lazy } from 'react';
import Link from './routes/Link';
import Route from './routes/Route';
import Routes from './routes/Routes';
import Loading from './ui/Loading';
import { HASH_MIDI } from '../hooks/location';
import github from '../assets/github-mark-white.svg';

const Home = lazy(() => import('./Home'));
const Midi = lazy(() => import('./Midi'));

export default function App() {
  return (
    <>
      <header className="flex items-center w-full h-14 px-4 border-b border-b-prim/5">
        <div className="container mx-auto flex flex-row items-center gap-6 md:gap-12">
          <Link to="/" className="flex flex-col text-xl font-bold">
            Léo Riera
            <span className="text-xs font-normal text-prim/60">Developer/</span>
          </Link>
          <nav className="flex flex-row gap-6 grow text-prim/60 hover:*:text-prim/80">
            <Link to="/" className="text-base">Home</Link>
            <Link to={HASH_MIDI} className="text-base">Midi</Link>
          </nav>
          <a href="https://github.com/Dowdow" target="_blank" rel="noreferrer" className="p-2 hover:bg-prim/15 rounded-md">
            <img src={github} alt="Dowdow GitHub page" className="w-6" />
          </a>
        </div>
      </header>
      <main className="px-4">
        <div className="container mx-auto">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route to={HASH_MIDI} element={<Midi />} />
              <Route element={<Home />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </>
  );
}