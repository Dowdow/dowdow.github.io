import routing from '../posts/routing.md';

const posts = [
  {
    title: 'Simple Routing system using hashes in React',
    slug: 'routing',
    date: '2024-05',
    file: routing,
  },
];

export function usePosts() {
  return posts;
}

export function usePost(slug) {
  return posts.find((a) => a.slug === slug);
}
