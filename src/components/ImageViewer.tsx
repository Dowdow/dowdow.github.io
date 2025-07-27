import { useEffect, useState } from "react";

interface ImageEvent {
  images: string[];
  index: number;
}

export default function ImageViewer() {
  const [visible, setVisible] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(0);

  function updateImages(event: CustomEventInit<ImageEvent>) {
    const { images, index } = event.detail as ImageEvent;
    setImages(images);
    setIndex(index);
    setVisible(true);
    console.log(event);
  }

  useEffect(() => {
    window.addEventListener("image-viewer", updateImages);
    return () => {
      window.removeEventListener("image-viewer", updateImages);
    };
  }, []);

  return (
    <div
      className={`${visible ? "fixed" : "hidden"} top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 backdrop-blur`}
      onClick={() => setVisible(false)}
    >
      <img
        src={images[index]}
        alt={`Big image ${index + 1}`}
        className="max-h-3/5 max-w-3/5 shadow-xl rounded"
      />
    </div>
  );
}
