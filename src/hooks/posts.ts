import routing from "../posts/routing.md";

interface Post {
  title: string;
  slug: string;
  date: string;
  file: string;
}

const posts = [
  {
    title: "Simple Routing system using hashes in React",
    slug: "routing",
    date: "2024-05",
    file: routing,
  } as Post,
];

export function usePosts(): Array<Post> {
  return posts;
}

export function usePost(slug: string): Post | undefined {
  return posts.find((a) => a.slug === slug);
}
