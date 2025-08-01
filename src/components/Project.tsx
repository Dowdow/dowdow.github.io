import Box from "./ui/Box";

interface Link {
  name: string;
  link: string;
}

interface ProjectProps {
  name: string;
  description: string;
  images: string[];
  links: Link[];
}

export default function Project({
  name,
  description,
  images,
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
      <p className="mt-3 text-prim/60">{description}</p>
      {images.length > 0 ? (
        <div className="flex gap-3 mt-3 overflow-x-scroll">
          {images.map((m, index) => (
            <img
              key={`img-${index}`}
              src={m}
              alt={`${name} image ${index + 1}`}
              className="w-40 h-40 rounded cursor-pointer object-cover"
              onClick={() => showImages(index)}
            />
          ))}
        </div>
      ) : null}
      {links.length > 0 ? (
        <div className="flex mt-5 gap-5">
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
      ) : null}
    </Box>
  );
}
