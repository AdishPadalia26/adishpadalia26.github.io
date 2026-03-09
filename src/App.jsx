import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Publications from "./components/Publications";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Skills from "./components/Skills";
import Preloader from "./components/Preloader";
import About from "./components/About";
import { Element } from "react-scroll";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for page to fully load, with a minimum display time
    const minDelay = new Promise((r) => setTimeout(r, 1800));
    const pageLoad = new Promise((r) => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", r, { once: true });
    });
    Promise.all([minDelay, pageLoad]).then(() => setLoading(false));
  }, []);
  useEffect(() => {
    let timeout;
    const onScroll = () => {
      document.body.classList.add("scrolling");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.body.classList.remove("scrolling");
      }, 1200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <Preloader loading={loading} />
      <Navbar />

      <Element name="home">
        <Hero />
      </Element>

      <Element name="about">
        <About />
      </Element>

      <Element name="skills">
        <Skills />
      </Element>

      <Element name="projects">
        <Projects />
      </Element>

      <Element name="experience">
        <Experience />
      </Element>

      <Element name="education">
        <Education />
      </Element>

      <Element name="publications">
        <Publications />
      </Element>

      <Element name="achievements">
        <Achievements />
      </Element>

      <Element name="contact">
        <Contact />
      </Element>
    </>
  );
}

export default App;
