import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Chip, IconButton, Stack, Fade } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * ExperienceCube
 * CSS 3D cube (front shows latest). Rotates horizontally through experiences.
 * - Accepts up to 6 experiences; using 4 horizontal faces for clarity (top/bottom hidden).
 * - Auto-rotates; pauses on interaction.
 */

const FACE_ORDER = ['front','right','back','left'];

const ExperienceCube = ({ experiences = [], autoRotateInterval = 6000, disableAuto = false }) => {
  const ordered = experiences; // assume latest first
  const faces = Array.from({ length: 4 }).map((_, i) => ordered[i % ordered.length]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const next = useCallback(() => setIndex(i => (i + 1) % faces.length), [faces.length]);
  const prev = useCallback(() => setIndex(i => (i - 1 + faces.length) % faces.length), [faces.length]);

  useEffect(() => {
    if (reducedMotion || disableAuto) return;
    if (paused) return;
    timerRef.current = setTimeout(next, autoRotateInterval);
    return () => clearTimeout(timerRef.current);
  }, [index, paused, next, autoRotateInterval, reducedMotion, disableAuto]);

  const angle = (index % faces.length) * -90;

  // drag/swipe state
  const drag = useRef({ active: false, startX: 0, delta: 0, lastX: 0, startTime: 0, lastTime: 0 });
  const threshold = 80;
  const velocityThreshold = 0.35; // px per ms

  const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const onPointerDown = (e) => {
    const x = pointerX(e);
    drag.current = { active: true, startX: x, delta: 0, lastX: x, startTime: performance.now(), lastTime: performance.now() };
    setPaused(true);
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const x = pointerX(e);
    drag.current.delta = x - drag.current.startX;
    drag.current.lastX = x;
    drag.current.lastTime = performance.now();
  };
  const onPointerUp = () => {
    if (!drag.current.active) return;
    const { delta, startTime, lastTime } = drag.current;
    drag.current.active = false;
    const velocity = delta / ((lastTime - startTime) || 1);
    if (delta < -threshold || velocity < -velocityThreshold) next();
    else if (delta > threshold || velocity > velocityThreshold) prev();
    setTimeout(() => setPaused(false), 800);
  };

  // keyboard navigation (focus the container)
  useEffect(() => {
    const handler = (e) => {
      if (document.activeElement !== containerRef.current) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); setPaused(true); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setPaused(true); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  // reduced motion fallback (fade between cards)
  if (reducedMotion) {
    return (
      <Box sx={{ position: 'relative', maxWidth: 860, mx: 'auto', mt: { xs: 3, md: 5 }, px: { xs: 1, md: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
          <IconButton size="small" aria-label="Previous" onClick={prev} disabled={faces.length < 2}><ChevronLeftIcon fontSize="small" /></IconButton>
          <IconButton size="small" aria-label="Next" onClick={next} disabled={faces.length < 2}><ChevronRightIcon fontSize="small" /></IconButton>
        </Box>
        {faces.map((exp, i) => (
          <Fade key={i} in={i===index} mountOnEnter unmountOnExit>
            <Box sx={{ position: i===index ? 'relative':'absolute', inset: 0 }}>
              <CubeFace exp={exp} face="front" active />
            </Box>
          </Fade>
        ))}
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
          {faces.map((_, i) => (
            <Box key={i} onClick={() => setIndex(i)} role="button" tabIndex={0} aria-label={`Go to slide ${i+1}`}
              sx={{ width: 10, height: 10, borderRadius: '50%', cursor: 'pointer', background: i===index ? 'linear-gradient(90deg,#0db8ef,#f6bb48)' : 'rgba(255,255,255,0.3)' }} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Experience cube"
      aria-live="polite"
      sx={{ position: 'relative', maxWidth: 920, mx: 'auto', mt: { xs: 3, md: 5 }, perspective: 1400, px: { xs: 1, md: 2 }, outline: 'none', userSelect: 'none' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <IconButton onClick={prev} aria-label="Previous experience" sx={navBtnSx('left')}> <ChevronLeftIcon /> </IconButton>
      <IconButton onClick={next} aria-label="Next experience" sx={navBtnSx('right')}> <ChevronRightIcon /> </IconButton>
  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: { xs: 2, md: 3 }, order: 2 }}>
        {faces.map((_, i) => (
          <Box key={i} onClick={() => setIndex(i)} role="button" tabIndex={0} aria-label={`Go to slide ${i+1}`}
            sx={{ width: 10, height: 10, borderRadius: '50%', cursor: 'pointer', outline: 'none', background: i===index ? 'linear-gradient(90deg,#0db8ef,#f6bb48)' : 'rgba(255,255,255,0.25)', transition: 'background .3s' }}
          />
        ))}
      </Stack>
      <Box aria-live="polite" sx={{ position: 'relative', height: { xs: 420, md: 440 }, mt: 2 }}>
        <Box sx={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transition: 'transform 1s cubic-bezier(.22,.84,.36,1)', transform: `translateZ(-300px) rotateY(${angle}deg)`}}>
          {faces.map((exp, i) => (
            <CubeFace key={i} exp={exp} face={FACE_ORDER[i]} index={i} active={i===index} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const faceBase = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const CubeFace = ({ exp, face, active }) => {
  const rotation = { front: 'rotateY(0deg) translateZ(300px)', right: 'rotateY(90deg) translateZ(300px)', back: 'rotateY(180deg) translateZ(300px)', left: 'rotateY(-90deg) translateZ(300px)' }[face];
  return (
    <Box sx={{ ...faceBase, transform: rotation, px: { xs: 1, md: 2 } }}>
      <Box component="article" sx={{ width: { xs: '100%', sm: 500, md: 560 }, maxWidth: '100%', height: '100%', bgcolor: '#ffffff', color: '#0b1424', borderRadius: 4, boxShadow: active ? '0 10px 40px -6px rgba(0,0,0,0.3)' : '0 4px 22px -4px rgba(0,0,0,0.18)', border: `1px solid ${exp.color}40`, display: 'flex', flexDirection: 'column', p: { xs: 2.4, md: 3 }, transition: 'box-shadow .6s, transform .6s' }}>
        <Typography sx={{ fontSize: '.65rem', letterSpacing: 1, fontWeight: 700, color: '#475569', textTransform: 'uppercase', mb: 1 }}>{exp.year}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', md: '1.25rem' }, lineHeight: 1.2, mb: 1 }}><Box component="span" sx={{ color: exp.color }}>{exp.org}</Box> – {exp.role}</Typography>
        {exp.subtitle && <Typography sx={{ fontSize: { xs: '.78rem', md: '.8rem' }, color: '#334155', mb: 1 }}>{exp.subtitle}</Typography>}
        <Chip label={exp.category} size="small" sx={{ alignSelf: 'flex-start', mb: 1, bgcolor: `${exp.color}10`, border: `1px solid ${exp.color}40`, fontWeight: 600 }} />
        <Typography sx={{ fontSize: '.65rem', letterSpacing: 0.5, color: '#64748b', mb: 1 }}>{exp.location}</Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.3, pr: .5, display: 'grid', gap: .75, fontSize: { xs: '.78rem', md: '.84rem' }, lineHeight: 1.5, color: '#1e293b', flexGrow: 1, overflowY: 'auto', '::-webkit-scrollbar': { width: 6 }, '::-webkit-scrollbar-thumb': { background: `${exp.color}55`, borderRadius: 6 } }}>
          {exp.bullets.map((b, i) => (<Box component="li" key={i} sx={{ '::marker': { color: exp.color } }}>{b}</Box>))}
        </Box>
      </Box>
    </Box>
  );
};

const navBtnSx = (side) => ({ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [side]: { xs: 8, md: 32 }, zIndex: 30, bgcolor: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.25)', '&:hover': { bgcolor: '#f1f5f9' }, display: { xs: 'none', sm: 'flex' } });

export default ExperienceCube;
