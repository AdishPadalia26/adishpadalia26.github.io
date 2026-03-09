import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EastIcon from "@mui/icons-material/East";
import RevealOnView from "./RevealOnView";

/* ─── Project Data ─── */
const projects = [
  {
  id: 1,
  title: "AI Agent for Healthcare Licensing & Credentialing",
  tagline: "Hybrid LLM + OCR agent that extracts provider data and auto-fills credentialing forms",
  tags: ["Python", "AWS", "Gemini API", "Next.js", "Flask", "LLM Agents"],
  accent: "#9f7aea",
  stat: "85%",
  statLabel: "Field Accuracy",
  category: "Agentic AI",
  image: "/images/ai-agents.png",
  links: {
    github: "https://github.com/AdishPadalia26/AI-Agent-for-Healthcare-Licensing-and-Credentialing",
    live: "https://www.youtube.com/watch?v=SP1D1DstFgg"
  }
},
  
  {
  id: 2,
  title: "ConstructGuard AI",
  tagline: "AI-powered construction safety monitoring system that detects hazards and enables dynamic insurance risk evaluation",
  tags: ["Python", "YOLOv11", "TensorFlow", "OpenCV", "React", "Flask", "Gemini API"],
  accent: "#4fd1c5",
  stat: "94%+",
  statLabel: "Detection Accuracy",
  category: "Computer Vision",
  image: "/images/construct-guard-ai.png",
  links: {
    github: "https://github.com/AdishPadalia26/ConstructGuard-AI",
    live: "https://devpost.com/software/constructguard-ai"
  }
},
  {
  id: 3,
  title: "Mental Health Bias & Advocacy Analysis",
  tagline: "Transformer-based NLP pipeline analyzing sentiment and bias evolution in mental health discourse across research and media",
  tags: ["Pytorch", "DistilBERT", "BART MNLI", "HuggingFace", "Transformers", "NLP"],
  accent: "#63b3ed",
  stat: "300+",
  statLabel: "Papers Analyzed",
  category: "Natural Language Processing",
  image: "/images/mental-health-bias-detection.png",
  links: {
    github: "https://github.com/AdishPadalia26/Mental-Health-Bias-and-Advocacy-Analysis"
  }
},
{
  id: 4,
  title: "Serverless Runtime with ML Autoscaling",
  tagline: "Machine learning–driven predictive autoscaling system for serverless workloads on Kubernetes",
  tags: ["Python", "Kubernetes", "OpenFaaS", "Docker", "Prometheus", "Scikit-learn"],
  accent: "#f687b3",
  stat: "15%",
  statLabel: "Latency Reduction",
  category: "Distributed Systems",
  image: "/images/autoscaling-kubernetes-ml.png",
  links: {
    github: "https://github.com/AdishPadalia26/Serverless-Runtime-with-Dynamic-Autoscaling-Using-Machine-Learning-and-Kubernetes"
  }
}
,{
  id: 5,
  title: "FoodFlow",
  tagline: "MERN-stack food ordering platform with secure authentication, real-time order tracking, and admin dashboard",
  tags: ["MongoDB", "Express", "React", "Node.js", "Tailwind CSS", "Firebase", "Redux"],
  accent: "#68d391",
  stat: "40%",
  statLabel: "Fewer Auth Errors",
  category: "Full Stack",
  image: "/images/foodFlow.webp",
  links: {
    github: "https://github.com/AdishPadalia26/FoodFlow"
  }
},
  {
  id: 6,
  title: "Train Reservation System",
  tagline: "Java-based railway booking platform with MVC architecture and MySQL database",
  tags: ["Java", "JSP", "Servlets", "MySQL", "Tomcat", "MVC"],
  accent: "#f6ad55",
  stat: "7+",
  statLabel: "DB Tables",
  category: "Backend Systems",
  image: "/images/train-reservation-system.webp",
  links: {
    github: "https://github.com/AdishPadalia26/TrainReservationSystem-JavaJSP-MySQL",
    live: "https://drive.google.com/file/d/1yPmVz9WBWu2k9mbKYKCI-t9jELYi7LsL/view"
  }
},
{
  id: 7,
  title: "AI Bots for Intelligent Navigation",
  tagline: "Autonomous navigation system combining path planning, probabilistic localization, and neural prediction",
  tags: ["Python", "PyTorch", "AI Algorithms", "Particle Filters", "Pathfinding", "Simulation"],
  accent: "#9f7aea",
  stat: "3",
  statLabel: "AI Paradigms",
  category: "Artificial Intelligence",
  image: "/images/ai-bots-navigation.jpg",  
  links: {
    github: "https://github.com/AdishPadalia26/AI-Bots-Intelligent-Navigation"
  }
},
{
  id: 8,
  title: "QuickBoard",
  tagline: "AI-powered banking onboarding platform enabling secure digital KYC and real-time identity verification",
  tags: ["Flutter", "Dart", "Firebase", "Computer Vision", "KYC", "WebAuthn"],
  accent: "#4fd1c5",
  stat: "98.5%",
  statLabel: "Fraud Detection",
  category: "Mobile & FinTech",
  image: "/images/quickboard.jpg",
  links: {
    github: "https://github.com/AdishPadalia26/QuickBoard"
  }
},
{
  id: 9,
  title: "Addzone",
  tagline: "Flutter-based marketplace for discovering and managing local businesses with map-based search",
  tags: ["Flutter", "Dart", "Firebase", "Google Maps API", "Mobile Development"],
  accent: "#63b3ed",
  stat: "500+",
  statLabel: "Listings Indexed",
  category: "Mobile Development",
  image: "/images/addZone.webp",
  links: {
    github: "https://github.com/AdishPadalia26/Addzone-Flutter-App"
  }
}


];

/* ─── Single Project Card with 3D Tilt ─── */
const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 220, damping: 22 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 420,
          borderRadius: "20px",
          overflow: "hidden",
          background: "linear-gradient(165deg, #0c1230 0%, #080d22 100%)",
          border: "1px solid #151b38",
          position: "relative",
          cursor: "default",
          transition: "box-shadow 0.5s ease, border-color 0.4s",
          "&:hover": {
            boxShadow: `0 30px 80px -20px ${project.accent}22, 0 0 40px -5px ${project.accent}0d`,
            borderColor: `${project.accent}30`,
            "& .card-img": { transform: "scale(1.08)" },
            "& .hover-glow": { opacity: 1 },
            "& .stat-pill": { transform: "translateY(0)", opacity: 1 },
            "& .view-btn": { bgcolor: project.accent, color: "#06071d", gap: 1 },
            "& .view-arrow": { opacity: 1, transform: "translateX(0)" },
            "& .accent-bar": { width: "100%" },
          },
        }}>
          {/* Accent bar */}
          <Box className="accent-bar" sx={{ position: "absolute", top: 0, left: 0, width: "35%", height: 3, bgcolor: project.accent, borderRadius: "0 0 2px 2px", transition: "width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)", zIndex: 3 }} />

          {/* Image */}
          <Box sx={{ position: "relative", width: "100%", height: 200, overflow: "hidden", flexShrink: 0 }}>
            <Box className="card-img" component="img" src={project.image} alt={project.title} sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)", filter: "brightness(0.5) saturate(0.8)" }} />
            <Box sx={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${project.accent}0a 0%, transparent 35%, #0a0f28 100%)`, pointerEvents: "none" }} />
            <Box className="hover-glow" sx={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${project.accent}12 0%, transparent 60%)`, opacity: 0, transition: "opacity 0.5s", pointerEvents: "none" }} />
            <Typography sx={{ position: "absolute", bottom: -8, right: 10, fontSize: "4rem", fontWeight: 900, fontFamily: "'Georgia', serif", color: "#ffffff06", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{num}</Typography>
            <Box sx={{ position: "absolute", top: 12, left: 12, fontSize: "0.45rem", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1.5, color: project.accent, bgcolor: "#06071dc0", backdropFilter: "blur(10px)", border: `1px solid ${project.accent}20`, px: 1.2, py: 0.4, borderRadius: "6px", textTransform: "uppercase", zIndex: 2 }}>{project.category}</Box>
            <Box className="stat-pill" sx={{ position: "absolute", bottom: 12, left: 12, display: "flex", alignItems: "baseline", gap: 0.6, bgcolor: "#06071de5", backdropFilter: "blur(12px)", border: `1px solid ${project.accent}25`, px: 1.5, py: 0.7, borderRadius: "10px", transform: "translateY(8px)", opacity: 0, transition: "all 0.45s cubic-bezier(0.25,0.46,0.45,0.94)", zIndex: 2 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "'Georgia', serif", color: project.accent, lineHeight: 1 }}>{project.stat}</Typography>
              <Typography sx={{ fontSize: "0.45rem", fontFamily: "monospace", color: "#8892b0", letterSpacing: 0.5, textTransform: "uppercase" }}>{project.statLabel}</Typography>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 2.5, py: 2.5 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mb: 1.5 }}>
              {project.tags.map((tag) => (
                <Box key={tag} sx={{ fontSize: "0.5rem", fontWeight: 600, fontFamily: "monospace", letterSpacing: 0.5, color: project.accent, bgcolor: `${project.accent}0a`, border: `1px solid ${project.accent}18`, px: 1, py: 0.3, borderRadius: "6px" }}>{tag}</Box>
              ))}
            </Box>
            <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, fontFamily: "'Georgia', serif", color: "#e6f1ff", lineHeight: 1.25, mb: 0.7 }}>{project.title}</Typography>
            <Typography sx={{ fontSize: "0.78rem", fontFamily: "'Georgia', serif", color: "#4a5a78", lineHeight: 1.6, mb: 2, flex: 1 }}>{project.tagline}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: "auto" }}>
              <Box className="view-btn" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2, py: 0.85, borderRadius: "10px", border: `1px solid ${project.accent}28`, bgcolor: `${project.accent}08`, color: project.accent, fontSize: "0.62rem", fontWeight: 700, fontFamily: "monospace", letterSpacing: 1, cursor: "pointer", transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
                VIEW PROJECT
                <EastIcon className="view-arrow" sx={{ fontSize: 14, opacity: 0, transform: "translateX(-8px)", transition: "all 0.4s ease" }} />
              </Box>
              {project.links.github && (
                <Box component="a" href={project.links.github} target="_blank" rel="noopener" sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: "#0e1430", display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5a78", transition: "all 0.25s", border: "1px solid #1a2040", "&:hover": { bgcolor: project.accent, color: "#06071d", borderColor: project.accent } }}>
                  <GitHubIcon sx={{ fontSize: 14 }} />
                </Box>
              )}
              {project.links.live && (
                <Box component="a" href={project.links.live} target="_blank" rel="noopener" sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: "#0e1430", display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5a78", transition: "all 0.25s", border: "1px solid #1a2040", "&:hover": { bgcolor: project.accent, color: "#06071d", borderColor: project.accent } }}>
                  <OpenInNewIcon sx={{ fontSize: 14 }} />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
};

/* ─── Main Component: Grid Layout ─── */
const Projects7 = () => (
  <Box
    id="projects"
    sx={{
      py: { xs: 8, md: 12 },
      bgcolor: "#06071d",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Background dot grid */}
    <Box sx={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #e6f1ff03 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
    {/* Ambient glows */}
    <Box sx={{ position: "absolute", top: "10%", left: "8%", width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, #9f7aea04 0%, transparent 60%)", pointerEvents: "none" }} />
    <Box sx={{ position: "absolute", bottom: "10%", right: "20%", width: 400, height: 350, borderRadius: "50%", background: "radial-gradient(ellipse, #63b3ed04 0%, transparent 60%)", pointerEvents: "none" }} />

    {/* Heading */}
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, mb: { xs: 5, md: 7 }, position: "relative", zIndex: 1 }}>
      <RevealOnView delay={0.01}>
        <Typography sx={{ fontSize: "0.45rem", fontFamily: "monospace", color: "#2a3a55", letterSpacing: 5, mb: 0.5 }}>SELECTED WORK</Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "2.8rem" }, fontFamily: "'Georgia', serif", color: "#e6f1ff", lineHeight: 1.1 }}>Projects</Typography>
        <Typography sx={{ fontSize: "0.6rem", fontFamily: "monospace", color: "#2a3a55", letterSpacing: 1, mt: 0.5 }}>({projects.length})</Typography>
        <Box sx={{ width: 50, height: 3, borderRadius: 2, background: "linear-gradient(90deg, #0db8ef, #9f7aea)", mt: 2 }} />
      </RevealOnView>
    </Box>

    {/* Grid */}
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, md: 4 },
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: { xs: 3, md: 4 },
        position: "relative",
        zIndex: 1,
      }}
    >
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </Box>
  </Box>
);

export default Projects7;