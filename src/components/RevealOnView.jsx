import React, { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const RevealOnView = ({ children, delay = 0.01, y = 24, duration = 0.6, amount = 0.25, ...rest }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
    else controls.start("hidden");
  }, [inView, controls]);

  const variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, type: "spring", stiffness: 100, damping: 18 },
    },
  };

  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={controls} {...rest}>
      {children}
    </motion.div>
  );
};

export default RevealOnView;
