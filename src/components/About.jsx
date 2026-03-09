import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { motion, useInView } from "framer-motion";
import RevealOnView from "./RevealOnView";

import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import ScienceIcon from "@mui/icons-material/Science";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkIcon from "@mui/icons-material/Work";
import ArticleIcon from "@mui/icons-material/Article";
import GroupsIcon from "@mui/icons-material/Groups";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CloudIcon from "@mui/icons-material/Cloud";


/* ═══════════════════════════════════════════
   CSS Keyframes
   ═══════════════════════════════════════════ */
const keyframes = `
  @keyframes about-glow-orbit {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes about-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ─── Stats Data ─── */
const stats = [
  { label: "Publications", value: 3, suffix: "", icon: ArticleIcon, color: "#e879f9" },
  { label: "Hackathon Wins", value: 1, suffix: "st", icon: EmojiEventsIcon, color: "#f6bb48" },
  { label: "Students Mentored", value: 200, suffix: "+", icon: GroupsIcon, color: "#0db8ef" },
  { label: "Research Accuracy", value: 99, suffix: "%", icon: ScienceIcon, color: "#4ade80" },
];

/* ─── What I Do Data ─── */
const expertise = [
  {
    icon: PsychologyIcon,
    title: "AI & Machine Learning",
    desc: "Deep Learning, Computer Vision, NLP, Generative AI, LLMs, RAG pipelines, and Agentic AI systems.",
    color: "#e879f9",
    gradient: "linear-gradient(135deg, #e879f920, #e879f908)",
  },
  {
    icon: CodeIcon,
    title: "Full-Stack Development",
    desc: "React, Next.js, Node.js, Flask, Django, Spring Boot — building scalable web apps end-to-end.",
    color: "#0db8ef",
    gradient: "linear-gradient(135deg, #0db8ef20, #0db8ef08)",
  },
  {
    icon: CloudIcon,
    title: "Cloud & DevOps",
    desc: "AWS, Docker, Kubernetes, CI/CD, Prometheus, Grafana — deploying and monitoring at scale.",
    color: "#f6bb48",
    gradient: "linear-gradient(135deg, #f6bb4820, #f6bb4808)",
  },
  {
    icon: ScienceIcon,
    title: "Research & Publications",
    desc: "3x published author in IEEE & Springer — medical imaging, NLP, traffic prediction.",
    color: "#4ade80",
    gradient: "linear-gradient(135deg, #4ade8020, #4ade8008)",
  },
];


/* ═══════════════════════════════════════════
   Stat Card
   ═══════════════════════════════════════════ */
const StatCard = ({ icon: Icon, label, value, suffix, color, index }) => (
  <RevealOnView delay={0.08 * index}>
    <Box
      component={motion.div}
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      sx={{
        position: "relative",
        textAlign: "center",
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        background: `linear-gradient(145deg, ${color}10, ${color}05)`,
        border: `1px solid ${color}30`,
        backdropFilter: "blur(12px)",
        cursor: "default",
        overflow: "hidden",
        minWidth: { xs: 140, md: 170 },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.7,
        },
        "&:hover::before": {
          animation: "about-shimmer 1.5s ease infinite",
          backgroundSize: "200% 100%",
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      <Icon sx={{ fontSize: 32, color, mb: 1, filter: `drop-shadow(0 0 8px ${color}60)` }} />
      <Typography
        variant="h3"
        sx={{
          fontWeight: 900,
          fontSize: { xs: "2rem", md: "2.5rem" },
          color,
          lineHeight: 1.1,
          textShadow: `0 0 20px ${color}40`,
        }}
      >
        <AnimatedCounter target={value} suffix={suffix} />
      </Typography>
      <Typography
        variant="body2"
        sx={{ mt: 0.5, color: "rgba(255,255,255,0.6)", fontWeight: 500, fontSize: { xs: 12, md: 13 }, letterSpacing: 0.5, textTransform: "uppercase" }}
      >
        {label}
      </Typography>
    </Box>
  </RevealOnView>
);

/* ═══════════════════════════════════════════
   Expertise Card
   ═══════════════════════════════════════════ */
const ExpertiseCard = ({ icon: Icon, title, desc, color, gradient, index }) => (
  <RevealOnView delay={0.1 * index}>
    <Box
      component={motion.div}
      whileHover={{ y: -4, boxShadow: `0 8px 32px ${color}25` }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        background: gradient,
        border: `1px solid ${color}20`,
        backdropFilter: "blur(8px)",
        cursor: "default",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${color}18`,
            border: `1px solid ${color}30`,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 24, color }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: 16, md: 18 }, color: "white" }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: { xs: 13, md: 14 } }}>
        {desc}
      </Typography>
    </Box>
  </RevealOnView>
);

/* ═══════════════════════════════════════════
   Main About Component
   ═══════════════════════════════════════════ */
const About = () => {
  return (
    <Box
      id="about"
      sx={{
        position: "relative",
        minHeight: "100vh",
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        bgcolor: "#040515",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Inject keyframes */}
      <style>{keyframes}</style>

      {/* ─── Background Decorations ─── */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, #0db8ef08 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "5%",
          right: "-8%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, #f6bb4808 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, #e879f905 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* ─── Section Title ─── */}
      <RevealOnView>
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 800,
            mb: { xs: 1, md: 2 },
            fontSize: { xs: "2rem", md: "2.5rem" },
            background: "linear-gradient(135deg, #0db8ef, #f6bb48)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          About Me
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ color: "rgba(255,255,255,0.4)", mb: { xs: 4, md: 6 }, fontSize: { xs: 14, md: 16 }, letterSpacing: 2, textTransform: "uppercase" }}
        >
          Get to know the person behind the code
        </Typography>
      </RevealOnView>

      {/* ─── Profile + Bio Row ─── */}
      <Box sx={{ maxWidth: 1100, mx: "auto", mb: { xs: 6, md: 8 }, ml: { xs: 0, md: 40 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 6 }}
          alignItems="center"
        >

          {/* Bio Text */}
          <RevealOnView delay={0.2}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: "1.5rem", md: "1.8rem" },
                }}
              >
                Adish Padalia
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: { xs: "center", md: "flex-start" }, flexWrap: "wrap", gap: 0.5 }}>
                <Chip
                  icon={<LocationOnIcon sx={{ fontSize: 14, color: "#0db8ef !important" }} />}
                  label="NYC Metro Area"
                  size="small"
                  sx={{
                    bgcolor: "#0db8ef15",
                    color: "#0db8ef",
                    border: "1px solid #0db8ef30",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: 14, color: "#4ade80 !important" }} />}
                  label="Open to Opportunities"
                  size="small"
                  sx={{
                    bgcolor: "#4ade8015",
                    color: "#4ade80",
                    border: "1px solid #4ade8030",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
              </Stack>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.85,
                  fontSize: { xs: 15, md: 16 },
                  mb: 2,
                }}
              >
                I'm a Software Engineer and AI/ML Researcher pursuing my{" "}
                <Box component="span" sx={{ color: "#0db8ef", fontWeight: 600 }}>
                  Master's in Computer Science at Rutgers University
                </Box>
                . With a strong foundation from my B.Tech at SPIT Mumbai (
                <Box component="span" sx={{ color: "#f6bb48", fontWeight: 600 }}>
                  Class Rank 4th
                </Box>
                ), I specialize in building intelligent systems at the intersection of AI/ML, full-stack development, and scalable cloud infrastructure.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.85,
                  fontSize: { xs: 14, md: 15 },
                  mb: 2,
                }}
              >
                My research at{" "}
                <Box component="span" sx={{ color: "#e879f9", fontWeight: 600 }}>
                  IIT Bombay (with AIIMS Delhi)
                </Box>{" "}
                produced a novel 99% accurate Brain MRI segmentation model with just 2K parameters — published in IEEE Xplore. At Rutgers, I've built multimodal LiDAR-camera 3D object detection pipelines and mentored 200+ students as a Teaching Assistant.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.8,
                  fontSize: { xs: 13, md: 14 },
                }}
              >
                When I'm not coding, you'll find me exploring emerging AI research, competing in hackathons (
                <Box component="span" sx={{ color: "#f6bb48" }}>HackRU 2025 Champion 🏆</Box>
                ), or contributing to open-source projects. I'm actively exploring 2026 full-time roles in Software Engineering, Machine Learning Engineering, and Data Science.
              </Typography>
            </Box>
          </RevealOnView>
        </Stack>
      </Box>

      {/* ─── Stats Row ─── */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </Box>
      </Box>

      {/* ─── What I Do ─── */}
      <Box sx={{ maxWidth: 1000, mx: "auto", mb: { xs: 6, md: 8 } }}>
        <RevealOnView>
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 700,
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "1.3rem", md: "1.5rem" },
              color: "rgba(255,255,255,0.9)",
            }}
          >
            What I{" "}
            <Box component="span" sx={{ color: "#0db8ef" }}>
              Specialize
            </Box>{" "}
            In
          </Typography>
        </RevealOnView>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {expertise.map((e, i) => (
            <ExpertiseCard key={e.title} {...e} index={i} />
          ))}
        </Box>
      </Box>

      <Box component="div" sx={{ color: "#0db8ef",
        height: 10,
       }}>
        {/* Spacer to prevent overlap with bottom line */}
      </Box>
      {/* ─── Bottom Decorative Line ─── */}
      <Box
        sx={{
          mt: { xs: 6, md: 8 },
          mx: "auto",
          width: "60%",
          maxWidth: 400,
          height: 2,
          borderRadius: 1,
          background: "linear-gradient(90deg, transparent, #0db8ef40, #f6bb4840, transparent)",
        }}
      />
    </Box>
  );
};

export default About;
