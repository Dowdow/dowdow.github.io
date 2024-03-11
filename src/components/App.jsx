import React from 'react';
import { HASH_MIDI } from '../hooks/location';
import Midi from './Midi';
import Home from './Home';
import Link from './routes/Link';
import Route from './routes/Route';
import Routes from './routes/Routes';
import github from '../assets/github-mark-white.svg';

export default function App() {
  return (
    <>
      <header className="w-full border-b border-b-prim/5">
        <div className="flex flex-row items-center gap-12 container h-20 mx-auto px-2">
          <Link to="/" className="flex flex-col text-xl font-bold">
            Léo Riera
            <span className="text-sm font-normal text-prim/60">Developer/</span>
          </Link>
          <nav className="flex flex-row gap-6 grow text-prim/60 hover:*:text-prim/80">
            <Link to="/" className="text-base">Home</Link>
            <Link to={HASH_MIDI} className="text-base">Midi</Link>
          </nav>
          <div className="flex gap-6 items-center">
            <a href="https://github.com/Dowdow" target="_blank" rel="noreferrer" className="p-2 hover:bg-prim/15 rounded-md">
              <img src={github} alt="Dowdow GitHub page" className="w-6" />
            </a>
            <div>{new Date().getFullYear()}</div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-2">
        <Routes>
          <Route to={HASH_MIDI} element={<Midi />} />
          <Route element={<Home />} />
        </Routes>
      </main>
    </>
  );
}
