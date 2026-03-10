import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useMotionValue, useSpring } from "framer-motion";
import RevealOnView from "./RevealOnView";

/* ─── skill data ─── */
const cdnBase = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const allSkills = [
  /* ── Languages ── */
  { name: "Python", category: "lang", color: "#3776ab", bg: "#3776ab18", logo: `${cdnBase}/python/python-original.svg`, level: 95, tag: "Expert" },
  { name: "JavaScript", category: "lang", color: "#f7df1e", bg: "#f7df1e18", logo: `${cdnBase}/javascript/javascript-original.svg`, level: 92, tag: "Expert" },
  { name: "TypeScript", category: "lang", color: "#3178c6", bg: "#3178c618", logo: `${cdnBase}/typescript/typescript-original.svg`, level: 88, tag: "Advanced" },
  { name: "C++", category: "lang", color: "#00599c", bg: "#00599c18", logo: `${cdnBase}/cplusplus/cplusplus-original.svg`, level: 85, tag: "Advanced" },
  { name: "C", category: "lang", color: "#a8b9cc", bg: "#a8b9cc18", logo: `${cdnBase}/c/c-original.svg`, level: 82, tag: "Proficient" },
  { name: "Java", category: "lang", color: "#ed8b00", bg: "#ed8b0018", logo: `${cdnBase}/java/java-original.svg`, level: 85, tag: "Advanced" },
  { name: "SQL", category: "lang", color: "#336791", bg: "#33679118", logo: `${cdnBase}/azuresqldatabase/azuresqldatabase-original.svg`, level: 88, tag: "Advanced" },

  /* ── Frontend ── */
  { name: "React", category: "front", color: "#61dafb", bg: "#61dafb18", logo: `${cdnBase}/react/react-original.svg`, level: 95, tag: "Expert" },
  { name: "Next.js", category: "front", color: "#ffffff", bg: "#ffffff12", logo: `${cdnBase}/nextjs/nextjs-original.svg`, level: 85, tag: "Advanced" },
  { name: "Tailwind CSS", category: "front", color: "#06b6d4", bg: "#06b6d418", logo: `${cdnBase}/tailwindcss/tailwindcss-original.svg`, level: 88, tag: "Advanced" },
  { name: "Material-UI", category: "front", color: "#007fff", bg: "#007fff18", logo: `${cdnBase}/materialui/materialui-original.svg`, level: 90, tag: "Expert" },
  { name: "Bootstrap", category: "front", color: "#7952b3", bg: "#7952b318", logo: `${cdnBase}/bootstrap/bootstrap-original.svg`, level: 85, tag: "Advanced" },
  { name: "Three.js", category: "front", color: "#049ef4", bg: "#049ef418", logo: `${cdnBase}/threejs/threejs-original.svg`, level: 78, tag: "Proficient" },

  /* ── Backend ── */
  { name: "Node.js", category: "back", color: "#68d391", bg: "#68d39118", logo: `${cdnBase}/nodejs/nodejs-original.svg`, level: 90, tag: "Expert" },
  { name: "Express", category: "back", color: "#68d391", bg: "#68d39118", logo: `${cdnBase}/express/express-original.svg`, level: 88, tag: "Advanced" },
  { name: "Flask", category: "back", color: "#ffffff", bg: "#ffffff12", logo: `${cdnBase}/flask/flask-original.svg`, level: 88, tag: "Advanced" },
  { name: "FastAPI", category: "back", color: "#009688", bg: "#00968818", logo: `${cdnBase}/fastapi/fastapi-original.svg`, level: 85, tag: "Advanced" },
  { name: "Django", category: "back", color: "#092e20", bg: "#0c4b3318", logo: `${cdnBase}/django/django-plain.svg`, level: 78, tag: "Proficient" },
  { name: "Spring Boot", category: "back", color: "#6db33f", bg: "#6db33f18", logo: `${cdnBase}/spring/spring-original.svg`, level: 75, tag: "Proficient" },
  { name: "PHP", category: "back", color: "#777bb4", bg: "#777bb418", logo: `${cdnBase}/php/php-original.svg`, level: 70, tag: "Familiar" },
  { name: "Nginx", category: "back", color: "#009639", bg: "#00963918", logo: `${cdnBase}/nginx/nginx-original.svg`, level: 72, tag: "Proficient" },

  /* ── Databases ── */
  { name: "MongoDB", category: "db", color: "#47a248", bg: "#47a24818", logo: `${cdnBase}/mongodb/mongodb-original.svg`, level: 88, tag: "Advanced" },
  { name: "PostgreSQL", category: "db", color: "#336791", bg: "#33679118", logo: `${cdnBase}/postgresql/postgresql-original.svg`, level: 85, tag: "Advanced" },
  { name: "SQLite", category: "db", color: "#003b57", bg: "#003b5718", logo: `${cdnBase}/sqlite/sqlite-original.svg`, level: 80, tag: "Proficient" },
  { name: "Firebase", category: "db", color: "#ffca28", bg: "#ffca2818", logo: `${cdnBase}/firebase/firebase-original.svg`, level: 82, tag: "Proficient" },

  /* ── AI / ML ── */
  { name: "TensorFlow", category: "ai", color: "#ff6f00", bg: "#ff6f0018", logo: `${cdnBase}/tensorflow/tensorflow-original.svg`, level: 88, tag: "Advanced" },
  { name: "PyTorch", category: "ai", color: "#ee4c2c", bg: "#ee4c2c18", logo: `${cdnBase}/pytorch/pytorch-original.svg`, level: 88, tag: "Advanced" },
  { name: "Scikit-learn", category: "ai", color: "#f6bb48", bg: "#f6bb4818", logo: `${cdnBase}/scikitlearn/scikitlearn-original.svg`, level: 90, tag: "Expert" },
  { name: "OpenCV", category: "ai", color: "#5c3ee8", bg: "#5c3ee818", logo: `${cdnBase}/opencv/opencv-original.svg`, level: 85, tag: "Advanced" },
  { name: "NumPy", category: "ai", color: "#013243", bg: "#01324318", logo: `${cdnBase}/numpy/numpy-original.svg`, level: 92, tag: "Expert" },
  { name: "Pandas", category: "ai", color: "#150458", bg: "#15045818", logo: `${cdnBase}/pandas/pandas-original.svg`, level: 90, tag: "Expert" },
  { name: "HuggingFace", category: "ai", color: "#ffbd45", bg: "#ffbd4518", logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg", level: 88, tag: "Advanced" },
  { name: "LangChain", category: "ai", color: "#1c3c3c", bg: "#1c3c3c18", logo: "https://api.nuget.org/v3-flatcontainer/langchain/0.12.3-dev.1/icon", level: 85, tag: "Advanced" },
  { name: "Seaborn", category: "ai", color: "#4c72b0", bg: "#4c72b018", logo: "https://seaborn.pydata.org/_images/logo-mark-lightbg.svg", level: 88, tag: "Advanced" },
  { name: "Matplotlib", category: "ai", color: "#11557c", bg: "#11557c18", logo: `${cdnBase}/matplotlib/matplotlib-original.svg`, level: 90, tag: "Expert" },

  /* ── DevOps & Cloud ── */
  { name: "Docker", category: "devops", color: "#2496ed", bg: "#2496ed18", logo: `${cdnBase}/docker/docker-original.svg`, level: 85, tag: "Advanced" },
  { name: "Kubernetes", category: "devops", color: "#326ce5", bg: "#326ce518", logo: `${cdnBase}/kubernetes/kubernetes-original.svg`, level: 78, tag: "Proficient" },
  { name: "Hadoop", category: "devops", color: "#66ccff", bg: "#66ccff18", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Hadoop_logo.svg/1280px-Hadoop_logo.svg.png?_=20130221043911", level: 80, tag: "Proficient" },
  { name: "Spark", category: "devops", color: "#e25a1c", bg: "#e25a1c18", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Apache_Spark_logo.svg", level: 78, tag: "Proficient" },
  { name: "Git", category: "devops", color: "#f05032", bg: "#f0503218", logo: `${cdnBase}/git/git-original.svg`, level: 95, tag: "Expert" },
  { name: "Linux", category: "devops", color: "#fcc624", bg: "#fcc62418", logo: `${cdnBase}/linux/linux-original.svg`, level: 88, tag: "Advanced" },
  { name: "AWS", category: "devops", color: "#ff9900", bg: "#ff990018", logo: `${cdnBase}/amazonwebservices/amazonwebservices-original-wordmark.svg`, level: 82, tag: "Proficient" },
  { name: "Azure", category: "devops", color: "#0078d4", bg: "#0078d418", logo: `${cdnBase}/azure/azure-original.svg`, level: 72, tag: "Familiar" },
  { name: "GCP", category: "devops", color: "#4285f4", bg: "#4285f418", logo: `${cdnBase}/googlecloud/googlecloud-original.svg`, level: 72, tag: "Familiar" },
  { name: "Prometheus", category: "devops", color: "#e6522c", bg: "#e6522c18", logo: `${cdnBase}/prometheus/prometheus-original.svg`, level: 70, tag: "Familiar" },
  { name: "Grafana", category: "devops", color: "#f46800", bg: "#f4680018", logo: `${cdnBase}/grafana/grafana-original.svg`, level: 70, tag: "Familiar" },

  /* ── Tools ── */
  { name: "VS Code", category: "tools", color: "#007acc", bg: "#007acc18", logo: `${cdnBase}/vscode/vscode-original.svg`, level: 95, tag: "Expert" },
  { name: "Postman", category: "tools", color: "#ff6c37", bg: "#ff6c3718", logo: `${cdnBase}/postman/postman-original.svg`, level: 90, tag: "Expert" },
  { name: "Jupyter", category: "tools", color: "#f37726", bg: "#f3772618", logo: `${cdnBase}/jupyter/jupyter-original.svg`, level: 88, tag: "Advanced" },
  { name: "Figma", category: "tools", color: "#a259ff", bg: "#a259ff18", logo: `${cdnBase}/figma/figma-original.svg`, level: 78, tag: "Proficient" },
  { name: "Excel", category: "tools", color: "#217346", bg: "#21734618", logo: "https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg", level: 92, tag: "Expert" },
  { name: "Power BI", category: "tools", color: "#f2c811", bg: "#f2c81118", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg", level: 85, tag: "Advanced" },
  { name: "Gemini", category: "tools", color: "#4285f4", bg: "#4285f418", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg", level: 90, tag: "Expert" },
  { name: "GPT", category: "tools", color: "#10a37f", bg: "#10a37f18", logo: "https://cdn.worldvectorlogo.com/logos/openai-2.svg", level: 92, tag: "Expert" },
  { name: "Claude", category: "tools", color: "#d4a574", bg: "#d4a57418", logo: "https://cdn.worldvectorlogo.com/logos/anthropic-1.svg", level: 90, tag: "Expert" },
  { name: "Colab", category: "tools", color: "#f9ab00", bg: "#f9ab0018", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Colaboratory_SVG_Logo.svg", level: 90, tag: "Expert" },
  { name: "Kaggle", category: "tools", color: "#20beff", bg: "#20beff18", logo: `${cdnBase}/kaggle/kaggle-original.svg`, level: 85, tag: "Advanced" },
];

const filters = [
  { key: "all", label: "All" },
  { key: "lang", label: "Languages" },
  { key: "front", label: "Frontend" },
  { key: "back", label: "Backend" },
  { key: "db", label: "Databases" },
  { key: "ai", label: "AI / ML" },
  { key: "devops", label: "DevOps" },
  { key: "tools", label: "Tools" },
];

/* ─── Marquee row (infinite horizontal scroll) ─── */
const MarqueeRow = ({ items, speed = 30, reverse = false }) => (
  <Box
    sx={{
      overflow: "hidden",
      width: "100%",
      py: 1,
      maskImage:
        "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      WebkitMaskImage:
        "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
    }}
  >
    <motion.div
      animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      style={{ display: "flex", gap: "16px", width: "max-content" }}
    >
      {/* duplicate list for seamless loop */}
      {[...items, ...items].map((s, i) => (
        <Box
          key={`${s.name}-${i}`}
          sx={{
            px: 2.5,
            py: 1,
            borderRadius: "12px",
            border: `1px solid ${s.color}40`,
            bgcolor: s.bg,
            color: s.color,
            fontWeight: 600,
            fontSize: { xs: "0.82rem", md: "0.9rem" },
            whiteSpace: "nowrap",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            transition: "transform .2s, box-shadow .2s",
            "&:hover": {
              transform: "scale(1.12)",
              boxShadow: `0 0 18px ${s.color}50`,
            },
          }}
        >
          <Box
            component="img"
            src={s.logo}
            alt={s.name}
            sx={{ width: 20, height: 20, objectFit: "contain", flexShrink: 0 }}
          />
          {s.name}
        </Box>
      ))}
    </motion.div>
  </Box>
);

/* ─── Magnetic skill node (follows cursor slightly) ─── */
const MagneticNode = ({ skill, delay }) => {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.25);
    y.set(dy * 0.25);
  };

  const handleLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -15 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0, rotate: 15 }}
      transition={{ duration: 0.45, delay, type: "spring", stiffness: 260, damping: 20 }}
      layout
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY, display: "inline-block" }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
          borderRadius: "16px",
          border: `2px solid ${hovered ? skill.color : skill.color + "40"}`,
          bgcolor: hovered ? skill.bg : "rgba(11,13,42,0.6)",
          backdropFilter: "blur(12px)",
          color: hovered ? skill.color : "#cfe8ff",
          fontWeight: 700,
          fontSize: { xs: "0.9rem", md: "1.05rem" },
          cursor: "pointer",
          transition: "all .3s ease",
          boxShadow: hovered
            ? `0 0 24px ${skill.color}50, inset 0 0 20px ${skill.color}15`
            : "0 2px 12px rgba(0,0,0,.3)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {/* shine sweep on hover */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: hovered ? "120%" : "-60%",
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            transition: "left .6s ease",
            pointerEvents: "none",
          }}
        />

        {/* Tooltip on hover */}
        <Box
          sx={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            px: 1.5,
            py: 0.6,
            borderRadius: "8px",
            bgcolor: "rgba(4,5,21,0.95)",
            border: `1px solid ${skill.color}40`,
            boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: hovered ? 1 : 0,
            transition: "opacity .25s ease",
            zIndex: 20,
          }}
        >
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: skill.color, lineHeight: 1.3 }}>
            {skill.tag} · {skill.level}%
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, position: "relative", zIndex: 1 }}>
          <Box
            component="img"
            src={skill.logo}
            alt={skill.name}
            sx={{ width: 24, height: 24, objectFit: "contain", flexShrink: 0 }}
          />
          {skill.name}
        </Box>

        {/* Proficiency bar at the bottom */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "3px",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${skill.color}50, ${skill.color})`,
              boxShadow: `0 0 8px ${skill.color}60`,
              borderRadius: "0 3px 0 0",
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );
};

/* ─── Main component ─── */
const Skills3 = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? allSkills
      : allSkills.filter((s) => s.category === activeFilter);

  // Split skills into 4 rows for the marquee
  const quarter = Math.ceil(allSkills.length / 4);
  const row1 = allSkills.slice(0, quarter);
  const row2 = allSkills.slice(quarter, quarter * 2);
  const row3 = allSkills.slice(quarter * 2, quarter * 3);
  const row4 = allSkills.slice(quarter * 3);

  return (
    <Box
      id="skills"
      sx={{
        minHeight: "100vh",
        py: { xs: 8, md: 12 },
        bgcolor: "#06071d",
        color: "#e6f1ff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* glow pulse keyframes */}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(13,184,239,0.35); }
          50% { box-shadow: 0 0 22px rgba(13,184,239,0.55), 0 0 40px rgba(13,184,239,0.15); }
        }
      `}</style>

      {/* ambient background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.07,
          background:
            "radial-gradient(ellipse at 30% 20%, #0db8ef 0%, transparent 55%), " +
            "radial-gradient(ellipse at 70% 80%, #9f7aea 0%, transparent 55%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Section 1: Heading ── */}
      <RevealOnView delay={0.01}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 800,
            mb: 1,
            fontSize: { xs: "2rem", md: "2.5rem" },
            position: "relative",
            zIndex: 1,
          }}
        >
          Skills & Expertise
        </Typography>
        <Typography
          align="center"
          sx={{
            color: "#8892b0",
            fontSize: { xs: "0.88rem", md: "1rem" },
            mb: { xs: 5, md: 6 },
            position: "relative",
            zIndex: 1,
          }}
        >
          Technologies I work with
        </Typography>
      </RevealOnView>

      {/* ── Section 2: Auto-scrolling marquee showcase ── */}
      <Box sx={{ mb: { xs: 6, md: 8 }, position: "relative", zIndex: 1 }}>
        <MarqueeRow items={row1} speed={35} />
        <MarqueeRow items={row2} speed={28} reverse />
        <MarqueeRow items={row3} speed={32} />
        <MarqueeRow items={row4} speed={30} reverse />
      </Box>

      {/* ── Section 3: Interactive filter grid ── */}
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 3 }, position: "relative", zIndex: 1 }}>
        {/* filter bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            mb: { xs: 4, md: 5 },
          }}
        >
          {filters.map((f) => {
            const count = f.key === "all" ? allSkills.length : allSkills.filter((s) => s.category === f.key).length;
            const isActive = activeFilter === f.key;
            return (
              <motion.button
                key={f.key}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: "6px 18px",
                  borderRadius: "999px",
                  border: isActive
                    ? "2px solid #0db8ef"
                    : "2px solid rgba(255,255,255,0.1)",
                  background: isActive
                    ? "rgba(13,184,239,0.15)"
                    : "transparent",
                  color: isActive ? "#0db8ef" : "#8892b0",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  outline: "none",
                  fontFamily: "inherit",
                  transition: "all .25s",
                  boxShadow: isActive ? "0 0 12px rgba(13,184,239,0.35)" : "none",
                  animation: isActive ? "glowPulse 2s ease-in-out infinite" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {f.label}
                <span style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  opacity: 0.7,
                  background: isActive ? "rgba(13,184,239,0.2)" : "rgba(255,255,255,0.06)",
                  padding: "1px 7px",
                  borderRadius: "999px",
                  color: isActive ? "#0db8ef" : "#8892b0",
                }}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </Box>

        {/* nodes grid */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 1.5, md: 2 },
            minHeight: 200,
          }}
        >
          {filtered.map((skill, i) => (
            <MagneticNode
              key={skill.name}
              skill={skill}
              delay={i * 0.04}
            />
          ))}
        </Box>

        {/* count badge */}
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginTop: "32px" }}
        >
          <Typography
            sx={{
              color: "#8892b0",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            Showing{" "}
            <Box
              component="span"
              sx={{ color: "#0db8ef", fontWeight: 700 }}
            >
              {filtered.length}
            </Box>{" "}
            {filtered.length === 1 ? "skill" : "skills"}
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Skills3;
