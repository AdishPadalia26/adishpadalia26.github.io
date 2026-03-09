import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * ContactBackground
 * Layered sci‑fi backdrop: gradient glow, animated starfield, subtle scan lines.
 */
export default function ContactBackground() {
  const stars = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 2.2 + 0.6,
    d: Math.random() * 6 + 4,
    o: Math.random() * 0.55 + 0.25
  })), []);

  return (
    <Box aria-hidden sx={root}>
      {/* Radial gradient core */}
      <Box sx={radial} />
      {/* Subtle grid / scan lines */}
      <Box sx={scanLines} />
      {/* Stars */}
      <Box sx={{ position:'absolute', inset:0 }}>
        {stars.map(star => (
          <motion.span
            key={star.id}
            initial={{ opacity:0 }}
            animate={{ opacity:[0, star.o, star.o * 0.3, star.o], y:[0,-4,2,0] }}
            transition={{ duration: star.d, repeat:Infinity, ease:'easeInOut', delay: star.id * 0.05 % 1.5 }}
            style={{
              position:'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              borderRadius:'50%',
              background: star.id % 11 === 0 ? '#f6bb48' : '#cbe9ff',
              boxShadow: '0 0 6px 2px #0db8ef55'
            }}
          />
        ))}
      </Box>
      {/* Animated scanning glow */}
      <motion.div
        style={{ position:'absolute', left:0, right:0, top:'-40%', bottom:'-40%', background:'linear-gradient(180deg, rgba(13,184,239,0.08), rgba(246,187,72,0.05) 60%, transparent)', mixBlendMode:'screen' }}
        animate={{ opacity:[0.15,0.35,0.15] }}
        transition={{ duration:9, repeat:Infinity, ease:'easeInOut' }}
      />
    </Box>
  );
}

const root = {
  position:'absolute',
  inset:0,
  overflow:'hidden',
  pointerEvents:'none'
};

const radial = {
  position:'absolute',
  inset:0,
  background:'radial-gradient(circle at 50% 35%, rgba(13,184,239,0.25), rgba(4,5,21,0) 60%)'
};

const scanLines = {
  position:'absolute',
  inset:0,
  background:`repeating-linear-gradient( to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)` ,
  mixBlendMode:'overlay',
  opacity:0.25
};
