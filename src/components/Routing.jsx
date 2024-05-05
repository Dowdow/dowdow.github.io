/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { Prism } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import markdownFile from '../articles/routing.md';

export default function Routing() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function init() {
      const response = await fetch(markdownFile);
      const markdown = await response.text();
      setData(markdown);
    }

    init();
  }, []);

  return (
    <article className="mt-10 md:mt-20 mx-auto max-w-3xl">
      <Markdown
        components={{
          h1({ children }) {
            return <h1 className="text-3xl md:text-6xl font-bold tracking-tighter text-center mb-10 md:mb-20">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mt-10 mb-4 text-2xl md:text-3xl font-bold">{children}</h2>;
          },
          p({ children }) {
            return <p className="my-6 text-lg md:text-xl">{children}</p>;
          },
          pre({ children }) {
            return children;
          },
          code({ children, className, node, ...rest }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <Prism
                {...rest}
                language={match[1]}
                style={vscDarkPlus}
                customStyle={{ fontSize: '16px' }}
                codeTagProps={{}}
              >
                {String(children).replace(/\n$/, '')}
              </Prism>
            ) : (
              <code {...rest} className="px-0.5 bg-white/20 rounded">
                {children}
              </code>
            );
          },
        }}
      >
        {data}
      </Markdown>
    </article>
  );
}