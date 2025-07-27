import Box from "./ui/Box";
import Link from "./routes/Link";
import { usePosts } from "../hooks/posts";
import { HASH_POST, generateRoute } from "../hooks/routes/routing";

export default function Posts() {
  const posts = usePosts();

  return (
    <section>
      <div className="flex flex-col justify-center items-center gap-y-2 h-40 text-center">
        <h1 className="text-6xl font-bold tracking-tighter">Posts</h1>
        <span className="text-lg text-prim/60">
          Sometimes I feel like writing some posts.
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {posts.map(({ title, date, slug, file }) => (
          <Link key={file} to={generateRoute(HASH_POST, { slug })}>
            <Box>
              <div className="text-sm tracking-tight text-prim/50 mb-2">
                {date}
              </div>
              <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            </Box>
          </Link>
        ))}
      </div>
    </section>
  );
}
