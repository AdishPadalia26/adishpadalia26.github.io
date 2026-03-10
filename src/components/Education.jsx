import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Typography, Chip, useMediaQuery, useTheme } from "@mui/material";
import { motion, useInView, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import RevealOnView from "./RevealOnView";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import MenuBookIcon from "@mui/icons-material/MenuBook";

/* ─── Education Data ─── */
const educationData = [
  {
    id: 1,
    degree: "Master of Science in Computer Science",
    school: "Rutgers University – New Brunswick",
    location: "New Jersey, USA",
    period: "Aug 2024 – May 2026",
    gpa: "3.70",
    gpaMax: "4.0",
    color: "#0db8ef",
    accent: "#67dbff",
    logo: "🏛️",
    honors: ["HackRU Fall 2025 Winner", "Graduate Research Assistant"],
    coursework: [
      "Machine Learning", "Deep Learning", "Computer Vision",
      "Natural Language Processing", "Algorithms", "Database Management",
      "Discrete Structures", "Software Engineering",
    ],
    highlights: [
      "Specializing in AI/ML, Computer Vision, and Generative AI.",
      "Graduate Research Assistant — built multimodal LiDAR-camera 3D object detection pipeline.",
      "Teaching Assistant for 3 courses: Comp Apps for Business, Database Management, Discrete Structures.",
      "Won 1st place out of 450+ participants at HackRU Fall 2025 for 'Construct Guard AI'.",
    ],
  },
  {
    id: 2,
    degree: "Bachelor of Technology in Information Technology",
    school: "Sardar Patel Institute of Technology – University of Mumbai",
    location: "Mumbai, India",
    period: "Aug 2020 – May 2024",
    gpa: "3.87",
    gpaMax: "4.0",
    color: "#f6bb48",
    accent: "#ffd97a",
    logo: "🎓",
    honors: ["Class Rank 4th", "Top 5 – Barclays Hackathon 2023"],
    coursework: [
      "Data Structures & Algorithms", "Operating Systems", "Object-Oriented Programming",
      "Database Management", "Computer Networks", "Artificial Intelligence",
      "Web Development", "Cloud Computing",
    ],
    highlights: [
      "Graduated 4th in class in Information Technology.",
      "Research Intern at IIT Bombay — published novel 3D Brain MRI segmentation work (IEEE Xplore).",
      "Technical Head for Sports Committee & ACSES Committee — led website development and workshops.",
      "Led development of AI-DL Virtual Labs platform used by 400+ students.",
    ],
  },
];

const TOTAL_LEAVES = educationData.length + 1;

/* ═══════════════════════════════════════════
   CSS Keyframes
   ═══════════════════════════════════════════ */
const bookKeyframes = `
  @keyframes book-glow-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  @keyframes book-spine-shimmer {
    0% { background-position: 0% 0%; }
    100% { background-position: 0% 200%; }
  }
  @keyframes book-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
`;

/* ═══════════════════════════════════════════
   GPA Badge
   ═══════════════════════════════════════════ */
const GPABadge = ({ gpa, max, color, compact }) => {
  const pct = (parseFloat(gpa) / parseFloat(max)) * 100;
  const size = compact ? 18 : 22;
  const r = compact ? 6.5 : 8.5;
  return (
    <Box sx={{
      display: "inline-flex", alignItems: "center",
      gap: compact ? 0.4 : 0.6,
      px: compact ? 0.7 : 1, py: compact ? 0.3 : 0.4,
      borderRadius: "10px", bgcolor: `${color}15`,
      border: `1.5px solid ${color}30`,
      flexShrink: 0, overflow: "hidden",
    }}>
      <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${color}25`} strokeWidth="2" />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * r}
            strokeDashoffset={2 * Math.PI * r * (1 - pct / 100)}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>
      </Box>
      <Box>
        <Typography sx={{ fontSize: compact ? "0.6rem" : "0.72rem", fontWeight: 800, color, lineHeight: 1 }}>
          {gpa}
        </Typography>
        <Typography sx={{ fontSize: compact ? "0.4rem" : "0.46rem", color: "#8892b0", fontWeight: 500 }}>
          / {max}
        </Typography>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   Page Content — three-tier font/size scaling
   ═══════════════════════════════════════════ */
const EduPageContent = ({ edu, side, bookWidth }) => {
  const isXS = bookWidth < 260;
  const isSM = bookWidth < 360;

  const p = isXS ? 1 : isSM ? 1.3 : 1.8;
  const degreeSize = isXS ? "0.62rem" : isSM ? "0.73rem" : "0.88rem";
  const schoolSize = isXS ? "0.52rem" : isSM ? "0.6rem" : "0.68rem";
  const bodySize = isXS ? "0.56rem" : isSM ? "0.62rem" : "0.68rem";
  const labelSize = isXS ? "0.5rem" : "0.55rem";
  const chipH = isXS ? 16 : isSM ? 18 : 21;
  const chipFs = isXS ? "0.48rem" : isSM ? "0.54rem" : "0.6rem";
  const logoSz = isXS ? 24 : isSM ? 28 : 32;
  const gap = isXS ? 0.8 : isSM ? 1 : 1.2;

  return (
    <Box sx={{
      width: "100%", height: "100%", boxSizing: "border-box",
      p, display: "flex", flexDirection: "column",
      overflow: "hidden", position: "relative",
    }}>
      <Box sx={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        display: "flex", flexDirection: "column",
        "&::-webkit-scrollbar": { width: 2 },
        "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(0,0,0,0.12)", borderRadius: 2 },
      }}>
        {/* Header row: logo | meta | GPA */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.6, mb: gap, flexShrink: 0 }}>
          <Box sx={{
            width: logoSz, height: logoSz, borderRadius: "7px",
            bgcolor: `${edu.color}12`, border: `1.5px solid ${edu.color}25`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isXS ? "0.75rem" : isSM ? "0.9rem" : "1rem", flexShrink: 0,
          }}>
            {edu.logo}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
              <CalendarTodayIcon sx={{ fontSize: 8, color: edu.color, flexShrink: 0 }} />
              <Typography sx={{
                fontSize: isXS ? "0.5rem" : "0.58rem", fontWeight: 700, color: edu.color,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {edu.period}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, mt: 0.15 }}>
              <LocationOnIcon sx={{ fontSize: 8, color: "#8892b0", flexShrink: 0 }} />
              <Typography sx={{
                fontSize: isXS ? "0.48rem" : "0.55rem", fontWeight: 500, color: "#8892b0",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {edu.location}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <GPABadge gpa={edu.gpa} max={edu.gpaMax} color={edu.color} compact />
          </Box>
        </Box>

        {/* Degree + School */}
        <Typography sx={{ fontSize: degreeSize, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.2, wordBreak: "break-word", mb: 0.25, flexShrink: 0 }}>
          {edu.degree}
        </Typography>
        <Typography sx={{ fontSize: schoolSize, color: "#555", fontWeight: 600, wordBreak: "break-word", mb: gap, flexShrink: 0 }}>
          {edu.school}
        </Typography>

        {/* Divider */}
        <Box sx={{ height: 1.5, borderRadius: 1, background: `linear-gradient(90deg, ${edu.color}50, transparent)`, mb: gap, flexShrink: 0 }} />

        {/* Honors */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.35, mb: gap, flexShrink: 0 }}>
          {edu.honors.map((h) => (
            <Chip key={h}
              icon={<EmojiEventsIcon sx={{ fontSize: 9, color: `${edu.color} !important` }} />}
              label={h} size="small"
              sx={{
                fontSize: chipFs, fontWeight: 700, height: chipH,
                bgcolor: `${edu.color}10`, color: edu.color,
                border: `1px solid ${edu.color}20`, borderRadius: "5px",
                "& .MuiChip-icon": { ml: 0.25 },
              }}
            />
          ))}
        </Box>

        {/* Highlights */}
        <Box sx={{ mb: gap, flexShrink: 0 }}>
          <Typography sx={{ fontSize: labelSize, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 0.7, mb: 0.4 }}>
            Highlights
          </Typography>
          {edu.highlights.map((h, i) => (
            <Box key={i} sx={{ display: "flex", gap: 0.5, mb: 0.45, alignItems: "flex-start" }}>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: edu.color, mt: "3px", flexShrink: 0, boxShadow: `0 0 3px ${edu.color}60` }} />
              <Typography sx={{ fontSize: bodySize, color: "#444", lineHeight: 1.4, wordBreak: "break-word" }}>
                {h}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Coursework */}
        <Box sx={{ flexShrink: 0, pb: 1.5 }}>
          <Typography sx={{ fontSize: labelSize, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 0.7, mb: 0.4 }}>
            Key Coursework
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.3 }}>
            {edu.coursework.map((c) => (
              <Chip key={c} label={c} size="small"
                sx={{
                  fontSize: chipFs, fontWeight: 600, height: chipH,
                  bgcolor: "rgba(0,0,0,0.04)", color: "#555",
                  border: "1px solid rgba(0,0,0,0.08)", borderRadius: "5px",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Page number */}
      <Typography sx={{
        position: "absolute", bottom: 5,
        ...(side === "left" ? { left: 8 } : { right: 8 }),
        fontSize: "0.48rem", color: "#bbb", fontStyle: "italic",
      }}>
        {edu.id}
      </Typography>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   Cover Front
   ═══════════════════════════════════════════ */
const CoverFront = ({ compact, isMobile }) => (
  <Box sx={{
    width: "100%", height: "100%",
    background: "linear-gradient(145deg, #0c1445 0%, #060a2e 40%, #0a0f3a 100%)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    p: compact ? 1.5 : 3, position: "relative", overflow: "hidden",
    borderRadius: "4px 16px 16px 4px",
  }}>
    <Box sx={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
    <Box sx={{ position: "absolute", inset: compact ? 8 : 14, border: "1.5px solid rgba(246,187,72,0.25)", borderRadius: "8px", pointerEvents: "none" }} />

    {[
      { top: compact ? 11 : 18, left: compact ? 11 : 18 },
      { top: compact ? 11 : 18, right: compact ? 11 : 18 },
      { bottom: compact ? 11 : 18, left: compact ? 11 : 18 },
      { bottom: compact ? 11 : 18, right: compact ? 11 : 18 },
    ].map((pos, i) => (
      <Box key={i} sx={{
        position: "absolute", ...pos, width: compact ? 10 : 12, height: compact ? 10 : 12,
        borderColor: "rgba(246,187,72,0.4)", borderStyle: "solid", borderWidth: 0,
        ...(i === 0 && { borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 3 }),
        ...(i === 1 && { borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 3 }),
        ...(i === 2 && { borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 3 }),
        ...(i === 3 && { borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 3 }),
      }} />
    ))}

    <Box sx={{ mb: compact ? 1 : 2, animation: "book-float 4s ease-in-out infinite" }}>
      <SchoolIcon sx={{ fontSize: compact ? 36 : 56, color: "#f6bb48", filter: "drop-shadow(0 0 12px rgba(246,187,72,0.4))" }} />
    </Box>

    <Typography sx={{ fontSize: compact ? "0.5rem" : "0.75rem", fontWeight: 600, letterSpacing: compact ? 2.5 : 4, color: "#f6bb48", textTransform: "uppercase", mb: 0.5, opacity: 0.7 }}>
      Academic
    </Typography>
    <Typography sx={{ fontSize: compact ? "1rem" : "1.7rem", fontWeight: 900, color: "#e6f1ff", textAlign: "center", lineHeight: 1.2, mb: 0.6, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
      Education
    </Typography>
    <Box sx={{ width: 28, height: 2, borderRadius: 1, background: "linear-gradient(90deg, transparent, #f6bb48, transparent)", mb: 0.8 }} />
    <Typography sx={{ fontSize: compact ? "0.55rem" : "0.78rem", color: "#8892b0", fontWeight: 500, textAlign: "center" }}>
      Adish Padalia
    </Typography>

    <Box sx={{ position: "absolute", bottom: compact ? 10 : 16, display: "flex", alignItems: "center", gap: 0.4, animation: "book-glow-pulse 2s ease-in-out infinite" }}>
      <Typography sx={{ fontSize: compact ? "0.46rem" : "0.52rem", color: "#0db8ef", fontWeight: 600, letterSpacing: 1 }}>
        {isMobile ? "TAP → TO OPEN" : "SCROLL TO OPEN"}
      </Typography>
      <NavigateNextIcon sx={{ fontSize: 10, color: "#0db8ef" }} />
    </Box>
  </Box>
);

/* ═══════════════════════════════════════════
   Cover Back
   ═══════════════════════════════════════════ */
const CoverBack = () => (
  <Box sx={{
    width: "100%", height: "100%",
    background: "linear-gradient(145deg, #0c1445 0%, #060a2e 40%, #0a0f3a 100%)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    p: 3, position: "relative", overflow: "hidden",
    borderRadius: "16px 4px 4px 16px",
  }}>
    <Box sx={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
    <MenuBookIcon sx={{ fontSize: 32, color: "#f6bb48", opacity: 0.3, mb: 1.5 }} />
    <Typography sx={{ fontSize: "0.72rem", color: "#8892b0", fontWeight: 500, textAlign: "center" }}>
      End of Academic Journey
    </Typography>
    <Box sx={{ width: 28, height: 1.5, borderRadius: 1, background: "linear-gradient(90deg, transparent, #f6bb4850, transparent)", my: 1.2 }} />
    <Typography sx={{ fontSize: "0.62rem", color: "#556", fontStyle: "italic" }}>
      — More chapters to come —
    </Typography>
  </Box>
);

/* ═══════════════════════════════════════════
   Blank decorative left page
   ═══════════════════════════════════════════ */
const BlankLeftPage = ({ eduIndex, compact }) => (
  <Box sx={{
    width: "100%", height: "100%", bgcolor: "#f4f0e8",
    borderRadius: "16px 2px 2px 16px",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden",
  }}>
    <Box sx={{ position: "absolute", inset: 0, opacity: 0.03, background: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,0.15) 28px, rgba(0,0,0,0.15) 29px)", pointerEvents: "none" }} />
    <Box sx={{ opacity: 0.15, textAlign: "center", px: 1 }}>
      <SchoolIcon sx={{ fontSize: compact ? 30 : 40, color: educationData[eduIndex]?.color || "#888" }} />
      <Typography sx={{ fontSize: "0.52rem", color: "#888", fontStyle: "italic", mt: 0.8, letterSpacing: 1.2, textTransform: "uppercase", wordBreak: "break-word", textAlign: "center" }}>
        {educationData[eduIndex]?.school || ""}
      </Typography>
    </Box>
  </Box>
);

/* ═══════════════════════════════════════════
   Book Leaf
   ═══════════════════════════════════════════ */
const BookLeaf = ({ index, isFlipped, totalLeaves, frontContent, backContent }) => (
  <Box sx={{
    position: "absolute", width: "100%", height: "100%",
    transformStyle: "preserve-3d", transformOrigin: "left center",
    transition: "transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1)",
    transform: isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)",
    zIndex: isFlipped ? totalLeaves + index : totalLeaves - index,
  }}>
    <Box sx={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", overflow: "hidden", borderRadius: "2px 16px 16px 2px", boxShadow: "2px 0 8px rgba(0,0,0,0.15), inset -2px 0 4px rgba(0,0,0,0.05)" }}>
      {frontContent}
    </Box>
    <Box sx={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", transform: "rotateY(180deg)", overflow: "hidden", borderRadius: "16px 2px 2px 16px", boxShadow: "-2px 0 8px rgba(0,0,0,0.15), inset 2px 0 4px rgba(0,0,0,0.05)" }}>
      {backContent}
    </Box>
  </Box>
);

/* ═══════════════════════════════════════════
   Page Dots
   ═══════════════════════════════════════════ */
const PageDots = ({ current, total }) => (
  <Box sx={{ display: "flex", gap: 0.7, alignItems: "center" }}>
    {Array.from({ length: total }, (_, i) => (
      <Box key={i} sx={{
        width: current === i ? 18 : 6, height: 6, borderRadius: 4,
        background: current === i ? "linear-gradient(90deg, #0db8ef, #f6bb48)" : "rgba(255,255,255,0.15)",
        transition: "all .4s cubic-bezier(.4,0,.2,1)",
        boxShadow: current === i ? "0 0 8px rgba(13,184,239,0.4)" : "none",
      }} />
    ))}
  </Box>
);

/* ═══════════════════════════════════════════
   Nav Arrow Button (mobile)
   ═══════════════════════════════════════════ */
const NavBtn = ({ onClick, disabled, children }) => (
  <Box onClick={disabled ? undefined : onClick} sx={{
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 44, height: 44, borderRadius: "50%",
    bgcolor: disabled ? "rgba(255,255,255,0.03)" : "rgba(13,184,239,0.12)",
    border: `1.5px solid ${disabled ? "rgba(255,255,255,0.06)" : "rgba(13,184,239,0.3)"}`,
    cursor: disabled ? "default" : "pointer",
    transition: "all 0.2s",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    "&:active": { transform: disabled ? "none" : "scale(0.9)" },
  }}>
    {children}
  </Box>
);

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
const Education3 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));   // < 900px
  const isXS    = useMediaQuery(theme.breakpoints.down("sm"));    // < 600px

  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [scrollRefReady, setScrollRefReady] = useState(false);
  const isInView = useInView(bookRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (scrollContainerRef.current) setScrollRefReady(true);
  }, [isMobile]);

  // Touch swipe refs
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const slideDir = useRef(1); // 1 = next, -1 = prev

  /* Scroll-driven turns (desktop only) */
  const { scrollYProgress } = useScroll(
    !isMobile && scrollRefReady
      ? { target: scrollContainerRef, offset: ["start start", "end end"] }
      : {}
  );
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isMobile) setCurrentPage(Math.min(Math.round(v * TOTAL_LEAVES), TOTAL_LEAVES));
  });

  /* Manual navigation */
  const goNext = useCallback(() => setCurrentPage((p) => Math.min(p + 1, TOTAL_LEAVES)), []);
  const goPrev = useCallback(() => setCurrentPage((p) => Math.max(p - 1, 0)), []);

  /* Touch handlers */
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) {
      dx < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  }, [goNext, goPrev]);

  /*
   * Responsive book sizing.
   *
   * When a page is flipped the book shifts translateX(flipShift).
   * Total horizontal space used ≈ bookWidth × (1 + flipShift).
   * On XS screens: 230px × 1.52 ≈ 350px → fits in 360px viewport.
   * On SM screens: 290px × 1.55 ≈ 450px → fits in 600px viewport.
   */
  const bookWidth  = isXS ? 230 : isMobile ? 290 : 460;
  const bookHeight = isXS ? 390 : isMobile ? 450 : 540;
  const flipShift  = isXS ? "52%" : isMobile ? "55%" : "60%";
  const isCompact  = bookWidth < 300;

  /* Build leaves */
  const leaves = [];
  for (let i = 0; i < TOTAL_LEAVES; i++) {
    const frontContent = i === 0
      ? <CoverFront compact={isCompact} isMobile={isMobile} />
      : (
        <Box sx={{ width: "100%", height: "100%", bgcolor: "#f7f3eb", borderRadius: "2px 16px 16px 2px" }}>
          <EduPageContent edu={educationData[i - 1]} side="right" bookWidth={bookWidth} />
        </Box>
      );

    const backContent = i === TOTAL_LEAVES - 1
      ? <CoverBack />
      : <BlankLeftPage eduIndex={i} compact={isCompact} />;

    leaves.push(<BookLeaf key={i} index={i} isFlipped={i < currentPage} totalLeaves={TOTAL_LEAVES} frontContent={frontContent} backContent={backContent} />);
  }

  const getPageLabel = () => {
    if (currentPage === 0) return "Cover";
    if (currentPage >= TOTAL_LEAVES) return "End";
    return educationData[currentPage - 1]?.degree?.split(" in ")[0] || `Page ${currentPage}`;
  };

  /* ── Shared 3D book scene ── */
  const BookScene = (
    <motion.div
      ref={bookRef}
      initial={{ opacity: 0, scale: 0.85, rotateX: 15 }}
      animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
      transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 80, damping: 18 }}
      style={{ perspective: 2000 }}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
    >
      <Box sx={{
        position: "relative",
        width: bookWidth, height: bookHeight,
        transformStyle: "preserve-3d",
        transform: currentPage > 0 ? `translateX(${flipShift}) rotateY(-8deg)` : "rotateY(-8deg)",
        transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1)",
        mx: "auto",
      }}>
        {/* Spine */}
        <Box sx={{
          position: "absolute", left: -14, top: 0, width: 14, height: "100%",
          background: "linear-gradient(90deg, #060a28, #0c1445 40%, #0e1850 60%, #0a1035)",
          backgroundSize: "100% 200%", animation: "book-spine-shimmer 6s linear infinite",
          borderRadius: "8px 0 0 8px",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.4), inset 1px 0 3px rgba(255,255,255,0.03)",
          zIndex: 20,
          "&::before": { content: '""', position: "absolute", top: "10%", left: 3, right: 3, height: 1, bgcolor: "rgba(246,187,72,0.3)" },
          "&::after":  { content: '""', position: "absolute", bottom: "10%", left: 3, right: 3, height: 1, bgcolor: "rgba(246,187,72,0.3)" },
        }} />

        {/* Page edge stack */}
        <Box sx={{
          position: "absolute",
          ...(currentPage >= TOTAL_LEAVES
            ? { left: -3, borderRadius: "3px 0 0 3px", boxShadow: "-2px 0 4px rgba(0,0,0,0.1)" }
            : { right: -3, borderRadius: "0 3px 3px 0", boxShadow: "2px 0 4px rgba(0,0,0,0.1)" }),
          top: 4, bottom: 4, width: 6,
          background: "repeating-linear-gradient(180deg, #e8e4dc 0px, #f0ece4 1px, #e8e4dc 2px)",
          transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)", zIndex: 0,
        }} />

        {/* Drop shadow */}
        <Box sx={{
          position: "absolute", bottom: -20, left: -20, right: -10, height: 40,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%)",
          filter: "blur(8px)", zIndex: -1,
        }} />

        {leaves}
      </Box>
    </motion.div>
  );

  /* ════════════════════════════════
     MOBILE — simple card carousel, no 3D flip
     ════════════════════════════════ */
  const mobileTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) {
      if (dx < 0) { slideDir.current = 1; goNext(); }
      else { slideDir.current = -1; goPrev(); }
    }
    touchStartX.current = null;
  }, [goNext, goPrev]);

  if (isMobile) {
    // Cards: cover (0) + edu pages (1..N) + end (N+1)
    const mobileCardWidth = isXS ? "92vw" : "88vw";
    const mobileCardHeight = isXS ? 440 : 500;

    const mobileGoNext = () => { slideDir.current = 1; goNext(); };
    const mobileGoPrev = () => { slideDir.current = -1; goPrev(); };

    const mobileCardContent = () => {
      if (currentPage === 0) return <CoverFront compact={isCompact} isMobile />;
      if (currentPage >= TOTAL_LEAVES) return <CoverBack />;
      return (
        <Box sx={{ width: "100%", height: "100%", bgcolor: "#f7f3eb", borderRadius: "12px" }}>
          <EduPageContent edu={educationData[currentPage - 1]} side="right" bookWidth={isXS ? 300 : 360} />
        </Box>
      );
    };

    return (
      <Box id="education" sx={{
        bgcolor: "#040515", color: "#e6f1ff",
        minHeight: "100svh",
        display: "flex", flexDirection: "column",
        py: 4, position: "relative", overflow: "hidden",
      }}>
        <style>{bookKeyframes}</style>
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.05, background: "radial-gradient(ellipse at 30% 40%, #0db8ef 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, #f6bb48 0%, transparent 55%)", filter: "blur(100px)", pointerEvents: "none" }} />

        {/* Heading */}
        <RevealOnView delay={0.01}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 0.5, mt: 2, fontSize: isXS ? "1.6rem" : "2rem", position: "relative", zIndex: 1 }}>
            Education
          </Typography>
          <Typography align="center" sx={{ color: "#8892b0", fontSize: "0.85rem", mb: 2.5, position: "relative", zIndex: 1 }}>
            My academic journey
          </Typography>
        </RevealOnView>

        {/* Card carousel + controls */}
        <Box sx={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 2, position: "relative", zIndex: 1,
          overflow: "hidden", px: 1,
        }}>
          {/* Slide card */}
          <Box
            onTouchStart={onTouchStart}
            onTouchEnd={mobileTouchEnd}
            sx={{
              width: mobileCardWidth, height: mobileCardHeight,
              position: "relative", overflow: "hidden",
              borderRadius: "14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPage}
                initial={{ x: slideDir.current * 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: slideDir.current * -300, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
              >
                {mobileCardContent()}
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Page label + dots */}
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#e6f1ff", mb: 0.25 }}>
              {getPageLabel()}
            </Typography>
            <Typography sx={{ fontSize: "0.6rem", color: "#8892b0" }}>
              {currentPage} / {TOTAL_LEAVES}
            </Typography>
          </Box>

          <PageDots current={currentPage} total={TOTAL_LEAVES + 1} />

          {/* Navigation row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <NavBtn onClick={mobileGoPrev} disabled={currentPage === 0}>
              <NavigateBeforeIcon sx={{ fontSize: 22, color: currentPage === 0 ? "#2a2a4a" : "#0db8ef" }} />
            </NavBtn>

            <Typography sx={{ fontSize: "0.62rem", color: "#44475a", fontStyle: "italic", textAlign: "center", minWidth: 110 }}>
              {currentPage === 0
                ? "Tap → or swipe left"
                : currentPage >= TOTAL_LEAVES
                ? "Tap ← to go back"
                : "Swipe or tap arrows"}
            </Typography>

            <NavBtn onClick={mobileGoNext} disabled={currentPage >= TOTAL_LEAVES}>
              <NavigateNextIcon sx={{ fontSize: 22, color: currentPage >= TOTAL_LEAVES ? "#2a2a4a" : "#0db8ef" }} />
            </NavBtn>
          </Box>
        </Box>
      </Box>
    );
  }

  /* ════════════════════════════════
     DESKTOP — scroll-driven, sticky
     ════════════════════════════════ */
  return (
    <Box ref={scrollContainerRef} sx={{ position: "relative", height: `${(TOTAL_LEAVES + 1) * 100}vh` }}>
      <Box id="education" sx={{
        position: "sticky", top: 0, height: "100vh",
        py: { md: 5, lg: 6 },
        bgcolor: "#040515", color: "#e6f1ff",
        overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        <style>{bookKeyframes}</style>
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.05, background: "radial-gradient(ellipse at 30% 40%, #0db8ef 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, #f6bb48 0%, transparent 55%)", filter: "blur(120px)", pointerEvents: "none" }} />

        <RevealOnView delay={0.01}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 0.8, mt: { md: 2, lg: 3 }, fontSize: { md: "2.2rem", lg: "2.5rem" }, position: "relative", zIndex: 1 }}>
            Education
          </Typography>
          <Typography align="center" sx={{ color: "#8892b0", fontSize: { md: "0.9rem", lg: "1rem" }, mb: { md: 3, lg: 4 }, position: "relative", zIndex: 1 }}>
            Flip through my academic journey
          </Typography>
        </RevealOnView>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2.5, position: "relative", zIndex: 1, flex: 1, justifyContent: "center" }}>
          {BookScene}

          <RevealOnView delay={0.3}>
            <Box sx={{ textAlign: "center", minWidth: 120 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#e6f1ff", mb: 0.4 }}>
                {getPageLabel()}
              </Typography>
              <Typography sx={{ fontSize: "0.63rem", color: "#8892b0", fontWeight: 500 }}>
                {currentPage} / {TOTAL_LEAVES}
              </Typography>
            </Box>
          </RevealOnView>

          <RevealOnView delay={0.35}>
            <PageDots current={currentPage} total={TOTAL_LEAVES + 1} />
          </RevealOnView>

          {currentPage === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              <Typography sx={{ fontSize: "0.7rem", color: "#556", fontStyle: "italic", textAlign: "center" }}>
                Scroll down to flip through pages
              </Typography>
            </motion.div>
          )}
        </Box>

        {/* Scroll progress bar */}
        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, bgcolor: "rgba(255,255,255,0.05)", zIndex: 2 }}>
          <motion.div style={{ height: "100%", background: "linear-gradient(90deg, #0db8ef, #f6bb48)", scaleX: scrollYProgress, transformOrigin: "left" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Education3;