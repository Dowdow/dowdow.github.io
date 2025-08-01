import { useEffect, useState, type WheelEvent } from "react";

interface ImageEvent {
  images: string[];
  index: number;
}

export default function ImageViewer() {
  const [visible, setVisible] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    function onUpdateImages(event: CustomEventInit<ImageEvent>) {
      const { images, index } = event.detail as ImageEvent;
      setImages(images);
      setIndex(index);
      setVisible(true);
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setVisible(false);
      }
    }

    window.addEventListener("image-viewer", onUpdateImages);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("image-viewer", onUpdateImages);
      window.removeEventListener("keyup", onKeyUp);
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

  const onWheel = (event: WheelEvent) => {
    const isTrackpad =
      event.deltaMode === 0 &&
      (Math.abs(event.deltaX) > 0 || Math.abs(event.deltaY) < 50);

    if (!isTrackpad) {
      event.currentTarget.scrollBy({
        left: event.deltaY * 10,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`${visible ? "fixed" : "hidden"} top-0 left-0 w-full h-full bg-black/50 backdrop-blur`}
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-full h-full flex items-center gap-20 snap-x snap-mandatory overflow-x-auto p-2 md:p-10 lg:p-20"
        onWheel={onWheel}
      >
        {images.map((image, i) => (
          <div
            key={i}
            className="h-full md:h-4/5 max-w-full shrink-0 snap-center"
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
