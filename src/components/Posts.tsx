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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts.map(({ title, description, date, image, slug, file }) => (
          <Link key={file} to={generateRoute(HASH_POST, { slug })}>
            <Box className="flex gap-5">
              <div className="min-w-40">
                <img
                  src={image}
                  alt={title}
                  className="h-40 w-40 object-cover rounded"
                />
              </div>
              <div>
                <span className="text-sm tracking-tight text-prim/50 mb-2">
                  {date}
                </span>
                <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                <p className="text-prim/80  mt-3">{description}</p>
              </div>
            </Box>
          </Link>
        ))}
      </div>
    </section>
  );
}
