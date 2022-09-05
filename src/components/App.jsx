import React from 'react';
import { HASH_ABOUT, HASH_PROJECTS } from '../hooks/location';
import About from './About';
import Home from './Home';
import Projects from './Projects';
import Link from './routes/Link';
import Route from './routes/Route';
import Routes from './routes/Routes';

export default function App() {
  return (
    <>
      <header className="w-full bg-zinc-50">
        <div className="flex flex-row items-center gap-20 container h-20 mx-auto px-2">
          <h1 className="text-xl">
            <Link to="/" className="font-bold">Léo Riera</Link>
            {' - Fullstack developer'}
          </h1>
          <nav className="flex flex-row gap-10 grow">
            <Link to={HASH_ABOUT} className="text-lg underline">About</Link>
            <Link to={HASH_PROJECTS} className="text-lg underline">Projects</Link>
          </nav>
          <div>{new Date().getFullYear()}</div>
        </div>
      </header>
      <main className="container mx-auto px-2">
        <Routes>
          <Route to={HASH_ABOUT} element={<About />} />
          <Route to={HASH_PROJECTS} element={<Projects />} />
          <Route element={<Home />} />
        </Routes>
      </main>
    </>
  );
}
