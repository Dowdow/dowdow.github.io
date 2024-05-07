import routing from '../articles/routing.md';

const articles = [
  {
    title: 'Simple Routing system using hashes in React',
    slug: 'routing',
    date: '2024-05',
    file: routing,
  },
];

export function useArticles() {
  return articles;
}

export function useArticle(slug) {
  return articles.find((a) => a.slug === slug);
}
