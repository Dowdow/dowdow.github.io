import Box from "./ui/Box";

interface Link {
  name: string;
  link: string;
}

interface ProjectProps {
  name: string;
  description: string;
  date: string;
  images: string[];
  tools: string[];
  links: Link[];
}

export default function Project({
  name,
  description,
  date,
  images,
  tools,
  links,
}: ProjectProps) {
  const showImages = (index: number) => {
    window.dispatchEvent(
      new CustomEvent("image-viewer", {
        detail: {
          images,
          index,
        },
      }),
    );
  };

  return (
    <Box>
      <h3 className="text-2xl font-bold tracking-tighter">{name}</h3>
      <span className="text-sm text-prim/60">{date}</span>
      <p className="mt-3 text-prim/80">{description}</p>
      {images.length > 0 ? (
        <div className="flex gap-3 mt-3 h-40 overflow-x-scroll">
          {images.map((m, index) => (
            <img
              key={`project-img-${index}`}
              src={m}
              alt={`${name} image ${index + 1}`}
              className="w-40 h-40 rounded cursor-pointer object-cover"
              onClick={() => showImages(index)}
            />
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap mt-3 gap-x-2 gap-y-0.5">
        {tools.map((t, index) => (
          <div key={`tool-${index}`} className="flex flex-wrap gap-x-2">
            <span className="text-prim/60 italic">{t}</span>
            {index < tools.length - 1 ? (
              <span className="text-prim/60 italic">-</span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex mt-3 gap-5">
        {links.map((l, index) => (
          <a
            key={`link-${index}`}
            href={l.link}
            target="_blank"
            rel="noopener"
            className="underline"
          >
            {l.name}
          </a>
        ))}
      </div>
    </Box>
  );
}
