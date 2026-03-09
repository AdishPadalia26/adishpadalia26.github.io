import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * ExperienceTimeline3D — ChronoFlo-style
 * - Curved SVG track with ticks
 * - Cards follow the curve (position + local tangent tilt)
 * - Right-side year ladder
 * - Reflective floor + bottom dot stream
 * - Wheel / arrow keys / swipe navigation
 */

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

export default function ExperienceTimeline3D({ experiences = [], activeIndex: controlledIndex }) {
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = controlledIndex !== undefined;
  const index = isControlled ? controlledIndex : internalIndex;
  const containerRef = useRef(null);
  const size = useSize(containerRef);
  const go = useCallback(
    (dir) => {
      if (isControlled) return;
      setInternalIndex((i) => clamp(i + dir, 0, experiences.length - 1));
    },
    [experiences.length, isControlled]
  );

  // Wheel (throttled) — only in uncontrolled mode
  const scrollingRef = useRef(false);
  useEffect(() => {
    if (isControlled) return;
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (scrollingRef.current) return;
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 10) return;
      scrollingRef.current = true;
      go(d > 0 ? 1 : -1);
      setTimeout(() => (scrollingRef.current = false), 340);
      e.preventDefault();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [go, isControlled]);

  // Keys — only in uncontrolled mode
  useEffect(() => {
    if (isControlled) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, isControlled]);

  // Swipe
  useSwipe(containerRef, go);

  // Geometry — cubic Bézier curve across the scene
  const curve = useMemo(() => makeCurve(size.width, size.height), [size.width, size.height]);

  // Visible window for perf
  const start = Math.max(0, index - 3);
  const end = Math.min(experiences.length - 1, index + 5);

  // Dynamically find parameter whose x is near visual center so active card sits centered
  const tActive = useMemo(() => findTForCenter(curve, size.width / 2), [curve, size.width]);
  const tStep = 0.1; // spacing along curve between cards

  return (
    <Box ref={containerRef} sx={rootSx}>
      {/* Buttons — hidden in controlled (scroll-lock) mode */}
      {!isControlled && (
        <IconButton aria-label="Previous" disabled={index === 0} onClick={() => go(-1)} sx={navBtn('left')}>
          <ChevronLeftIcon />
        </IconButton>
      )}
      {!isControlled && (
        <IconButton aria-label="Next" disabled={index === experiences.length - 1} onClick={() => go(1)} sx={navBtn('right')}>
          <ChevronRightIcon />
        </IconButton>
      )}

      {/* Reflective floor */}
      <Box sx={floorSx} />

      {/* Curved track + ticks (SVG) */}
      <TrackSVG curve={curve} />

  {/* Year labels along arc */}
  <YearArcLabels curve={curve} experiences={experiences} activeIndex={index} />

      {/* Cards along the curve */}
      {experiences.slice(start, end + 1).map((exp, i) => {
        const realIdx = start + i;
        const depth = realIdx - index; // 0 at active
        const t = clamp(tActive + depth * tStep, 0.04, 0.96);
        const { x, y, ang } = pointOnCurve(curve, t);
        // visual depth
        const d = Math.abs(depth);
        const scale = 1 - 0.1 * d;
        const opacity = 1 - 0.12 * d;
        const blur = d > 4 ? 2 : 0;
        const zIndex = 100 - d;

        return (
          <Box
            key={exp.org + exp.role}
            sx={{
              position: 'absolute',
              transformStyle: 'preserve-3d',
              // Center the card on the arc point then rotate and scale
              transform: `translate(${x}px, ${y}px) translate(-50%, 0%) rotate(${ang}deg) scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 900ms cubic-bezier(.22,.84,.36,1), opacity .7s, filter .7s',
              opacity,
              filter: blur ? `blur(${blur}px)` : 'none',
              zIndex,
            }}
          >
            <Card exp={exp} active={depth === 0} />
          </Box>
        );
      })}


      {/* Progress dots */}
      <Box sx={dotsRowSx} aria-live="polite">
        {experiences.map((_, i) => (
          <Box
            key={i}
            onClick={() => !isControlled && setInternalIndex(i)}
            role="button"
            aria-label={`Go to ${i + 1}`}
            sx={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              cursor: 'pointer',
              background: i === index ? 'linear-gradient(90deg,#0db8ef,#f6bb48)' : 'rgba(255,255,255,0.25)',
              transition: 'background .3s',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

/* ---------------- UI Pieces ---------------- */

const Card = ({ exp, active }) => (
  <Box
    role="group"
    aria-label={`${exp.org} — ${exp.role}, ${exp.year}`}
    aria-current={active ? 'true' : undefined}
    sx={cardSx(exp.color, active)}
  >
    <Typography sx={yearSx}>{exp.year}</Typography>
    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1.02rem', md: '1.12rem' }, mb: 1, lineHeight: 1.25 }}>
      <Box component="span" sx={{ color: exp.color }}>
        {exp.org}
      </Box>{' '}
      – {exp.role}
    </Typography>
    {exp.subtitle && (
      <Typography sx={{ fontSize: { xs: '.7rem', md: '.75rem' }, color: '#334155', mb: 1 }}>{exp.subtitle}</Typography>
    )}
    <Chip
      size="small"
      label={exp.category}
      sx={{ bgcolor: `${exp.color}12`, border: `1px solid ${exp.color}44`, fontWeight: 600, mb: 1, maxWidth: '100%' }}
    />
    <Typography sx={{ fontSize: '.6rem', letterSpacing: 0.5, color: '#64748b', mb: 1 }}>{exp.location}</Typography>
    <Box component="ul" sx={bulletsSx(exp.color)}>
      {exp.bullets.map((b, i) => (
        <Box component="li" key={i} sx={{ '::marker': { color: exp.color } }}>
          {b}
        </Box>
      ))}
    </Box>

    {/* Reflection */}
    <Box sx={reflectionSx} />
  </Box>
);

function TrackSVG({ curve }) {
  const { p0, p1, p2, p3, w, h } = curve;
  // build path
  const d = `M ${p0.x},${p0.y} C ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
  // ticks along path
  const tickTs = Array.from({ length: 26 }, (_, i) => i / 25); // 0..1
  const ticks = tickTs.map((t, i) => {
    const { x, y, ang } = pointOnCurve(curve, t);
    const len = i % 5 === 0 ? 28 : 16; // long every 5th
    return (
      <line
        key={i}
        x1={x}
        y1={y}
        x2={x + Math.cos((ang - 90) * DEG2RAD) * len}
        y2={y + Math.sin((ang - 90) * DEG2RAD) * len}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={i % 5 === 0 ? 2 : 1}
      />
    );
  });

  return (
    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {/* soft highlight around path */}
        <path d={d} fill="none" stroke="rgba(13,184,239,0.14)" strokeWidth="42" />
        <path d={d} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        {ticks}
      </svg>
    </Box>
  );
}

function YearArcLabels({ curve, experiences, activeIndex }) {
  const years = experiences.map(e => e.year);
  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {years.map((y, i) => {
        // distribute along 0..1 but clamp a little to keep within arc ends
        const t = lerp(0.05, 0.95, i / Math.max(years.length - 1, 1));
        const { x, y: yy, ang } = pointOnCurve(curve, t);
        // move label outward (above arc) along outward normal
        const normalRad = (ang - 90) * (Math.PI / 180); // same orientation used for tick marks
        const OFFSET = 46; // distance above arc
        const lx = x + Math.cos(normalRad) * OFFSET;
        const ly = yy + Math.sin(normalRad) * OFFSET;
        return (
          <Typography
            key={i}
            sx={{
              position: 'absolute',
              left: lx,
              top: ly,
              transform: 'translate(-50%, -50%)',
              fontSize: { xs: '.75rem', md: '.9rem' },
              fontWeight: 700,
              letterSpacing: 1.5,
              color: '#fff',
              opacity: i === activeIndex ? 1 : 0.55,
              transition: 'opacity .4s',
              textShadow: i === activeIndex
                ? '0 2px 6px rgba(0,0,0,0.6), 0 0 8px rgba(13,184,239,0.6)'
                : '0 2px 4px rgba(0,0,0,0.4)'
            }}
          >
            {y}
          </Typography>
        );
      })}
    </Box>
  );
}


/* ---------------- Geometry helpers ---------------- */

const DEG2RAD = Math.PI / 180;

function useSize(ref) {
  const [s, setS] = useState({ width: 1200, height: 620 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      setS({ width: cr.width, height: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return s;
}

function makeCurve(w, h) {
  // Control points tuned for a ChronoFlo-ish S-curve
  const p0 = { x: w * 0.08, y: h * 0.74 };
  const p1 = { x: w * 0.34, y: h * 0.18 };
  const p2 = { x: w * 0.72, y: h * 0.28 };
  const p3 = { x: w * 0.90, y: h * 0.70 };
  return { p0, p1, p2, p3, w, h };
}

function pointOnCurve({ p0, p1, p2, p3 }, t) {
  const x =
    (1 - t) ** 3 * p0.x +
    3 * (1 - t) ** 2 * t * p1.x +
    3 * (1 - t) * t ** 2 * p2.x +
    t ** 3 * p3.x;
  const y =
    (1 - t) ** 3 * p0.y +
    3 * (1 - t) ** 2 * t * p1.y +
    3 * (1 - t) * t ** 2 * p2.y +
    t ** 3 * p3.y;

  // derivative for tangent angle
  const dx =
    3 * (1 - t) ** 2 * (p1.x - p0.x) +
    6 * (1 - t) * t * (p2.x - p1.x) +
    3 * t ** 2 * (p3.x - p2.x);
  const dy =
    3 * (1 - t) ** 2 * (p1.y - p0.y) +
    6 * (1 - t) * t * (p2.y - p1.y) +
    3 * t ** 2 * (p3.y - p2.y);

  const ang = (Math.atan2(dy, dx) * 180) / Math.PI; // degrees
  return { x, y, ang };
}

function findTForCenter(curve, targetX) {
  // binary search along t in [0,1] for x close to targetX
  let lo = 0, hi = 1, bestT = 0.5, bestDiff = Infinity;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const { x } = pointOnCurve(curve, mid);
    const diff = Math.abs(x - targetX);
    if (diff < bestDiff) { bestDiff = diff; bestT = mid; }
    if (x < targetX) lo = mid; else hi = mid;
  }
  return bestT;
}

/* ---------------- Styles ---------------- */

const rootSx = {
  position: 'relative',
  height: { xs: 620, md: 660 },
  mt: 2,
  overflow: 'hidden',
  px: { xs: 1, md: 2 },
  background: '#06071d',
  borderRadius: 2,
};

const floorSx = {
  position: 'absolute',
  left: '50%',
  top: '56%',
  width: 2200,
  height: 1600,
  transform: 'translateX(-50%) rotateX(78deg)',
  transformOrigin: 'center top',
  background:
    'radial-gradient(circle at 50% 25%, rgba(13,184,239,0.12), transparent 58%), radial-gradient(circle at 60% 60%, rgba(246,187,72,0.08), transparent 65%)',
  pointerEvents: 'none',
};

const cardSx = (color, active) => ({
  position: 'relative',
  width: { xs: 260, sm: 360, md: 440 },
  minHeight: { xs: 240, md: 290 },
  background: '#ffffff',
  color: '#0b1424',
  borderRadius: 6,
  p: { xs: 2, md: 3 },
  boxShadow: active
    ? '0 22px 52px -12px rgba(0,0,0,0.35), 0 6px 16px -4px rgba(0,0,0,0.28)'
    : '0 12px 36px -10px rgba(0,0,0,0.25)',
  border: `1px solid ${color}40`,
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow .8s',
});

const yearSx = {
  fontSize: '.58rem',
  letterSpacing: 1.5,
  fontWeight: 800,
  color: '#475569',
  textTransform: 'uppercase',
  mb: 0.5,
};

const bulletsSx = (color) => ({
  m: 0,
  pl: 2.2,
  pr: 0.5,
  listStyle: 'disc',
  display: 'grid',
  gap: 0.6,
  fontSize: { xs: '.68rem', md: '.75rem' },
  lineHeight: 1.45,
  color: '#1e293b',
});

const reflectionSx = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: -120,
  height: 120,
  background: 'linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0) 70%)',
  transform: 'scaleY(-1)',
  maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.4), transparent)',
  WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.4), transparent)',
  pointerEvents: 'none',
};

const navBtn = (side) => ({
  position: 'absolute',
  top: '50%',
  [side]: { xs: 8, md: 24 },
  transform: 'translateY(-50%)',
  zIndex: 20,
  width: { xs: 44, md: 52 },
  height: { xs: 44, md: 52 },
  bgcolor: 'rgba(13,184,239,0.12)',
  border: '1px solid rgba(13,184,239,0.3)',
  color: '#0db8ef',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 20px rgba(13,184,239,0.15)',
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': { fontSize: '1.8rem' },
  '&:hover': { bgcolor: 'rgba(13,184,239,0.25)', boxShadow: '0 6px 28px rgba(13,184,239,0.3)', color: '#67dbff' },
  '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.04)', color: '#4a5a78', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'none' },
  display: { xs: 'none', sm: 'flex' },
});

const dotsRowSx = {
  position: 'absolute',
  bottom: 8,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  gap: 8,
};

/* ---------------- Hooks ---------------- */

function useSwipe(ref, go) {
  const touchRef = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = (e) => (touchRef.current = { x: e.touches[0].clientX });
    const move = (e) => {
      if (!touchRef.current) return;
      const dx = e.touches[0].clientX - touchRef.current.x;
      if (Math.abs(dx) > 42) {
        go(dx < 0 ? 1 : -1);
        touchRef.current = null;
      }
    };
    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchmove', move, { passive: true });
    return () => {
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchmove', move);
    };
  }, [go, ref]);
}
