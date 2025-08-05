import routing_img from "../assets/posts/routing.png";
import routing_md from "../assets/posts/routing.md";
import routing_enhanced_img from "../assets/posts/routing-enhanced.png";
import routing_enhanced_md from "../assets/posts/routing-enhanced.md";

interface Post {
  title: string;
  slug: string;
  description: string;
  date: string;
  image: string;
  file: string;
}

const posts: Post[] = [
  {
    title: "Enhancing our hash routing system with params and typescript",
    slug: "routing-enhanced",
    description:
      "A follow up to our previous post about routing. Here we'll add parameters support, like a slug. And add typescript support for better debugging.",
    date: "2025-08",
    image: routing_enhanced_img,
    file: routing_enhanced_md,
  },
  {
    title: "Simple routing system using hashes in React",
    slug: "routing",
    description:
      "In this brief post, I'll guide you through the process of building a straightforward routing system in React using hashes, inspirired by the syntax of react-router.",
    date: "2024-05",
    image: routing_img,
    file: routing_md,
  },
];

export function usePosts(): Post[] {
  return posts;
}

export function usePost(slug: string): Post | undefined {
  return posts.find((a) => a.slug === slug);
}
