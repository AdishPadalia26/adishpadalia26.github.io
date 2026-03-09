import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useInView } from "framer-motion";
import RevealOnView from "./RevealOnView";

/* ─── Retro / vintage color palette ─── */
const posters = [
  {
    id: 1,
    stat: "🥇",
    statLabel: "1ST PLACE · 450+ PARTICIPANTS",
    headline: "★ CHAMPION ★",
    title: "HACKRU\nFALL 2025",
    tagline: "Rutgers University's Flagship Hackathon",
    detail: "Built 'Construct Guard AI' — an AI + Computer Vision platform using YOLOv11 and Gemini API for real-time breach detection and adaptive risk-based insurance",
    footer: "RUTGERS UNIVERSITY · NEW BRUNSWICK, NJ",
    bg: "#1a0a06",
    border: "#c4501a",
    accent: "#e8832a",
    text: "#f5e6d0",
    rosette: "#c4501a",
  },
  {
    id: 2,
    stat: "TOP 5",
    statLabel: "OUT OF 200 TEAMS",
    headline: "DATA STELLAR",
    title: "BARCLAYS\nHACKATHON",
    tagline: "Barclays Data Stellar Hackathon 2023",
    detail: "Led a team to secure a top 5 position building a secure customer onboarding application with advanced data intelligence",
    footer: "BARCLAYS · MUMBAI, INDIA · 2023",
    bg: "#060d18",
    border: "#1e5a8a",
    accent: "#3a9fd8",
    text: "#d0e4f5",
    rosette: "#1e5a8a",
  },
  {
    id: 3,
    stat: "3x",
    statLabel: "PEER-REVIEWED PUBLICATIONS",
    headline: "WORLD-CLASS",
    title: "PUBLISHED\nAUTHOR",
    tagline: "IEEE Xplore & Springer · 2023–2024",
    detail: "Published 3 research papers in IEEE and Springer across medical imaging, traffic prediction, and NLP — including a novel 99% accurate Brain MRI model",
    footer: "IIT BOMBAY · AIIMS DELHI · ICACRS · ICCCNT · SMARTCOM",
    bg: "#0e0a18",
    border: "#5a3a9a",
    accent: "#8a6ad8",
    text: "#e0d0f5",
    rosette: "#5a3a9a",
  },
  {
    id: 4,
    stat: "99%",
    statLabel: "MODEL ACCURACY",
    headline: "BREAKTHROUGH",
    title: "BRAIN MRI\nRESEARCH",
    tagline: "IIT Bombay · In Collaboration with AIIMS Delhi",
    detail: "Engineered a novel U-Net with just 2K trainable parameters achieving 99% accuracy in 3D Brain MRI skull-stripping, outperforming all state-of-the-art models",
    footer: "PUBLISHED IN IEEE XPLORE · JAN 2024",
    bg: "#180a12",
    border: "#a83262",
    accent: "#e0508a",
    text: "#f5d0e0",
    rosette: "#a83262",
  },
  {
    id: 5,
    stat: "4th",
    statLabel: "CLASS RANK",
    headline: "PRESENTING THE",
    title: "TOP\nGRADUATE",
    tagline: "B.Tech Information Technology · SPIT Mumbai",
    detail: "Graduated 4th in class with a 3.87/4.0 GPA from one of Mumbai's premier engineering institutes",
    footer: "UNIVERSITY OF MUMBAI · CLASS OF 2024",
    bg: "#18140a",
    border: "#a8881e",
    accent: "#d8b83a",
    text: "#f5f0d0",
    rosette: "#a8881e",
  },
  {
    id: 6,
    stat: "1500+",
    statLabel: "LIVES IMPACTED",
    headline: "GIVING BACK",
    title: "COMMUNITY\nSERVICE",
    tagline: "NayePankh Foundation · Rotary Club of Bombay",
    detail: "Volunteered at NayePankh Foundation for fundraising and distributing essentials; coordinated Rotary Club initiatives reaching 500+ soldiers and 1,000+ individuals for mental health awareness",
    footer: "NAYEPANKH · 2023 | ROTARY CLUB · 2021–2022",
    bg: "#180e06",
    border: "#a86a1e",
    accent: "#d8a03a",
    text: "#f5e8d0",
    rosette: "#a86a1e",
  },
  {
    id: 7,
    stat: "200+",
    statLabel: "STUDENTS MENTORED",
    headline: "THE DEDICATED",
    title: "TEACHING\nASSISTANT",
    tagline: "Three Courses · 95% Positive Rating",
    detail: "TA for Computer Apps, Database Management, and Discrete Structures — led recitations, graded exams, and delivered lab support at Rutgers",
    footer: "RUTGERS UNIVERSITY · SEP 2024 – PRESENT",
    bg: "#0a1412",
    border: "#1e8a6a",
    accent: "#3ad8a8",
    text: "#d0f5e8",
    rosette: "#1e8a6a",
  },
];

/* ─── Corner ornament SVG ─── */
const CornerOrnament = ({ color, position }) => {
  const transforms = {
    tl: "rotate(0)",
    tr: "rotate(90deg)",
    br: "rotate(180deg)",
    bl: "rotate(270deg)",
  };
  return (
    <Box
      sx={{
        position: "absolute",
        width: 28,
        height: 28,
        ...(position === "tl" && { top: 8, left: 8 }),
        ...(position === "tr" && { top: 8, right: 8 }),
        ...(position === "br" && { bottom: 8, right: 8 }),
        ...(position === "bl" && { bottom: 8, left: 8 }),
        transform: transforms[position],
      }}
    >
      <svg viewBox="0 0 28 28" fill="none">
        <path d="M0 0 L28 0 L28 6 L6 6 L6 28 L0 28 Z" fill={color} opacity="0.6" />
        <path d="M0 0 L14 0 L14 3 L3 3 L3 14 L0 14 Z" fill={color} opacity="0.9" />
      </svg>
    </Box>
  );
};

/* ─── Single poster card ─── */
const PosterCard = ({ poster, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotate: index % 2 === 0 ? -3 : 3 }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 800 }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 280, md: 300 },
          position: "relative",
          cursor: "default",
          transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
          "&:hover": {
            transform: "scale(1.03) rotate(-1deg)",
            zIndex: 10,
            "& .poster-inner": {
              boxShadow: `0 20px 50px -10px ${poster.border}50, 0 0 0 1px ${poster.border}`,
            },
            "& .poster-stat": {
              transform: "scale(1.08)",
              textShadow: `0 0 30px ${poster.accent}40`,
            },
          },
        }}
      >
        {/* Outer thick border */}
        <Box
          className="poster-inner"
          sx={{
            bgcolor: poster.bg,
            border: `4px solid ${poster.border}`,
            p: "10px",
            position: "relative",
            overflow: "hidden",
            transition: "box-shadow 0.4s ease",
            boxShadow: `0 10px 30px -8px #00000060`,
          }}
        >
          {/* Inner decorative border */}
          <Box
            sx={{
              border: `2px solid ${poster.border}60`,
              p: { xs: 2, md: 2.5 },
              position: "relative",
            }}
          >
            {/* Corner ornaments */}
            <CornerOrnament color={poster.border} position="tl" />
            <CornerOrnament color={poster.border} position="tr" />
            <CornerOrnament color={poster.border} position="br" />
            <CornerOrnament color={poster.border} position="bl" />

            {/* ─── Content ─── */}
            <Box sx={{ textAlign: "center", py: 0.5, overflow: "hidden" }}>
              {/* Headline kicker */}
              <Typography
                sx={{
                  fontSize: "0.5rem",
                  fontWeight: 800,
                  color: poster.accent,
                  fontFamily: "monospace",
                  letterSpacing: 4,
                  mb: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {poster.headline}
              </Typography>

              {/* Top rule */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                  justifyContent: "center",
                }}
              >
                <Box sx={{ flex: 1, height: 1, bgcolor: `${poster.border}50` }} />
                <Box sx={{ width: 6, height: 6, transform: "rotate(45deg)", bgcolor: poster.accent, opacity: 0.6 }} />
                <Box sx={{ flex: 1, height: 1, bgcolor: `${poster.border}50` }} />
              </Box>

              {/* Main title — BIG, BOLD, STACKED */}
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.7rem" },
                  fontWeight: 900,
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  color: poster.text,
                  lineHeight: 1,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  whiteSpace: "pre-line",
                  mb: 1,
                  textShadow: `2px 2px 0 ${poster.border}40`,
                }}
              >
                {poster.title}
              </Typography>

              {/* Decorative star rule */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ width: 25, height: 1, bgcolor: `${poster.border}40` }} />
                <Typography sx={{ fontSize: "0.5rem", color: poster.accent, lineHeight: 1 }}>★</Typography>
                <Typography sx={{ fontSize: "0.38rem", color: `${poster.border}80`, lineHeight: 1 }}>★</Typography>
                <Typography sx={{ fontSize: "0.5rem", color: poster.accent, lineHeight: 1 }}>★</Typography>
                <Box sx={{ width: 25, height: 1, bgcolor: `${poster.border}40` }} />
              </Box>

              {/* Giant stat */}
              <Box sx={{ position: "relative", py: 0.5 }}>
                {/* Rosette / badge behind stat */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    border: `2px dashed ${poster.rosette}30`,
                    pointerEvents: "none",
                  }}
                />
                <Typography
                  className="poster-stat"
                  sx={{
                    fontSize: { xs: "2.2rem", md: "2.6rem" },
                    fontWeight: 900,
                    fontFamily: "'Georgia', serif",
                    color: poster.accent,
                    lineHeight: 1,
                    whiteSpace: "pre-line",
                    textShadow: `0 0 15px ${poster.accent}20, 3px 3px 0 ${poster.bg}`,
                    transition: "transform 0.3s ease, text-shadow 0.3s ease",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {poster.stat}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.42rem",
                    fontWeight: 800,
                    color: `${poster.accent}60`,
                    fontFamily: "monospace",
                    letterSpacing: 2,
                    mt: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {poster.statLabel}
                </Typography>
              </Box>

              {/* Divider */}
              <Box
                sx={{
                  mx: "auto",
                  width: "70%",
                  height: 2,
                  bgcolor: `${poster.border}30`,
                  my: 1,
                  position: "relative",
                  "&::before, &::after": {
                    content: '""',
                    position: "absolute",
                    top: -3,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: `1.5px solid ${poster.border}40`,
                    bgcolor: poster.bg,
                  },
                  "&::before": { left: -4 },
                  "&::after": { right: -4 },
                }}
              />

              {/* Tagline */}
              <Typography
                sx={{
                  fontSize: "0.52rem",
                  fontWeight: 700,
                  color: poster.accent,
                  fontFamily: "'Georgia', serif",
                  fontStyle: "italic",
                  mb: 0.5,
                  letterSpacing: 0.5,
                }}
              >
                {poster.tagline}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  fontSize: "0.55rem",
                  color: `${poster.text}80`,
                  lineHeight: 1.5,
                  fontFamily: "'Georgia', serif",
                  mb: 1,
                  px: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {poster.detail}
              </Typography>

              {/* Bottom rule */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ flex: 1, height: 1, bgcolor: `${poster.border}40` }} />
                <Box sx={{ width: 4, height: 4, transform: "rotate(45deg)", bgcolor: `${poster.border}60` }} />
                <Box sx={{ flex: 1, height: 1, bgcolor: `${poster.border}40` }} />
              </Box>

              {/* Footer */}
              <Typography
                sx={{
                  fontSize: "0.38rem",
                  fontWeight: 700,
                  color: `${poster.border}80`,
                  fontFamily: "monospace",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {poster.footer}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
const Achievements = () => {
  return (
    <Box
      id="achievements"
      sx={{
        minHeight: "100vh",
        py: { xs: 6, md: 10 },
        bgcolor: "#040610",
        color: "#e6f1ff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Faint radial backdrop */}
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, #ffffff02 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* ─── Title ─── */}
      <RevealOnView delay={0.01}>
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 }, px: 2, position: "relative", zIndex: 2 }}>
          <Typography
            sx={{
              fontSize: "0.5rem",
              fontWeight: 800,
              color: "#2a3050",
              fontFamily: "monospace",
              letterSpacing: 5,
              mb: 1.5,
            }}
          >
            ★ ★ ★ NOW SHOWING ★ ★ ★
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.8rem" },
              fontWeight: 900,
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: "#e6f1ff",
              lineHeight: 1.1,
              letterSpacing: 4,
              textTransform: "uppercase",
              textShadow: "3px 3px 0 #0a0e1c",
              position: "relative",
              display: "inline-block",
              "&::before": {
                content: '""',
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: 3,
                background: "linear-gradient(90deg, transparent, #c4501a, transparent)",
              },
            }}
          >
            Achievements
          </Typography>
          <Typography
            sx={{
              fontSize: "0.55rem",
              color: "#1e2540",
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              mt: 2.5,
              letterSpacing: 1,
            }}
          >
            A Collection of Vintage Milestones
          </Typography>
        </Box>
      </RevealOnView>

      {/* ─── Poster Grid ─── */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: { xs: 3, md: 4 },
          maxWidth: 1100,
          mx: "auto",
          px: { xs: 2, md: 3 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {posters.map((poster, i) => (
          <PosterCard key={poster.id} poster={poster} index={i} />
        ))}
      </Box>
    </Box>
  );
};

export default Achievements;
