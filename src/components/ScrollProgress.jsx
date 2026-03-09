import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -1,
        height: 3,
        transformOrigin: "0% 50%",
        background: "linear-gradient(90deg, #0db8ef, #f6bb48)",
        scaleX,
        zIndex: 10,
        borderRadius: "0 2px 2px 0",
      }}
    />
  );
};

export default ScrollProgress;
