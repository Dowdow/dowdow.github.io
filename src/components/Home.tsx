import me from "../assets/me.jpg";
import Project from "./Project";
import { projects } from "../hooks/projects";
import ImageViewer from "./ImageViewer";

export default function Home() {
  return (
    <>
      <ImageViewer />
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start lg:items-center gap-5 md:gap-10 lg:gap-20 my-5 md:my-20 mx-0 md:mx-10 lg:mx-20">
        <div className="min-w-60 md:min-w-40 lg:min-w-80">
          <img
            src={me}
            alt="Léo Riera"
            className="w-60 md:w-40 lg:w-80 rounded"
          />
        </div>
        <div className="grow">
          <h1 className="text-5xl font-bold tracking-tighter">Léo Riera</h1>
          <div className="text-xl text-prim/60 mt-1">Developer</div>
          <p className="mt-6 text-lg text-prim/80">
            Hi, I’m Léo, aka Dowdow.
            <br />
            <br />
            I’m a passionate developer with over 10 years of professional
            experience, primarily focused on web development.
            <br />
            My go-to languages are JavaScript and PHP, although I’ve recently
            been diving more and more into Go.
            <br />
            <br />
            If you’d like to learn more about my academic and professional
            background, feel free to check out my <i>LinkedIn</i> profile.
            <br />
            Here, you’ll find a showcase of my personal projects — welcome to my
            creative space.
            <br />
            <br />
            Outside of coding, I also make music. You can find me on streaming
            platforms under the name <i>Buzz les Snares</i>, a duo I formed with
            my brother, who’s a music producer.
            <br />
            <br />
            🦆
          </p>
        </div>
      </div>
      <div className="mt-10 mb-40">
        <div className="flex justify-center">
          <h2 className="text-6xl font-bold tracking-tighter">Projects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
          {projects.map((p, index) => (
            <Project
              key={index}
              name={p.name}
              description={p.description}
              images={p.images}
              links={p.links}
            />
          ))}
        </div>
      </div>
    </>
  );
}
