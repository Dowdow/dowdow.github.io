import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Loading from "./ui/Loading";
import { useParams } from "../hooks/routing";
import { usePost } from "../hooks/posts";

export default function Post() {
  const { slug } = useParams();
  const post = usePost(slug);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(post.file)
      .then((response) => response.text())
      .then((markdown) => setData(markdown));
  }, []);

  if (data === null) {
    return <Loading />;
  }

  return (
    <article className="mt-10 md:mt-20 mx-auto max-w-3xl">
      <Markdown
        components={{
          h1({ children }) {
            return (
              <h1 className="text-3xl md:text-6xl font-bold tracking-tighter text-center mb-10 md:mb-20">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="mt-10 mb-4 text-2xl md:text-3xl font-bold">
                {children}
              </h2>
            );
          },
          p({ children }) {
            return <p className="my-6 text-lg md:text-xl">{children}</p>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400"
              >
                {children}
              </a>
            );
          },
          pre({ children }) {
            return children;
          },
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <Prism
                language={match[1]}
                style={vscDarkPlus}
                customStyle={{ fontSize: "16px" }}
                codeTagProps={{}}
              >
                {String(children).replace(/\n$/, "")}
              </Prism>
            ) : (
              <code className="px-0.5 bg-white/20 rounded-sm">{children}</code>
            );
          },
        }}
      >
        {data}
      </Markdown>
    </article>
  );
}
