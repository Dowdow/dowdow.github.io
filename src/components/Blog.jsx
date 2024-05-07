import React from 'react';
import Box from './ui/Box';
import Link from './routes/Link';
import { useArticles } from '../hooks/articles';
import { HASH_ARTICLE, generateRoute } from '../hooks/routing';

export default function Blog() {
  const articles = useArticles();

  return (
    <section>
      <div className="flex flex-col justify-center items-center gap-y-2 h-40 text-center">
        <h1 className="text-6xl font-bold tracking-tighter">Blog</h1>
        <span className="text-lg text-prim/60">Sometimes I feel like writing some blog articles.</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {articles.map(({ title, date, slug, file }) => (
          <Link key={file} to={generateRoute(HASH_ARTICLE, { slug })}>
            <Box>
              <div className="text-sm tracking-tight text-prim/50 mb-2">{date}</div>
              <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            </Box>
          </Link>
        ))}
      </div>
    </section>
  );
}
