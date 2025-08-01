import { useEffect, useState } from "react";

interface ImageEvent {
  images: string[];
  index: number;
}

export default function ImageViewer() {
  const [visible, setVisible] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    function updateImages(event: CustomEventInit<ImageEvent>) {
      const { images, index } = event.detail as ImageEvent;
      setImages(images);
      setIndex(index);
      setVisible(true);
    }

    function keyPressed(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setVisible(false);
      }
    }

    window.addEventListener("image-viewer", updateImages);
    window.addEventListener("keyup", keyPressed);
    return () => {
      window.removeEventListener("image-viewer", updateImages);
      window.removeEventListener("keyup", keyPressed);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
  }, [visible]);

  useEffect(() => {
    const target = document.querySelector(`[data-image-index="${index}"]`);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [index, images]);

  return (
    <div
      className={`${visible ? "fixed" : "hidden"} top-0 left-0 w-full h-full bg-black/50 backdrop-blur`}
      onClick={() => setVisible(false)}
    >
      <div className="relative w-full h-full flex items-center gap-20 snap-x snap-mandatory overflow-x-auto px-2 md:px-10 lg:px-20">
        {images.map((image, i) => (
          <div
            key={i}
            className="w-full h-full md:h-4/5 md:w-4/5 shrink-0 snap-center"
            data-image-index={i}
          >
            <img
              src={image}
              alt={`Big image ${i}`}
              className="w-full h-full object-contain shrink-0 shadow-xl rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
