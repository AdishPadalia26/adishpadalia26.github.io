import React, { useState, useRef } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { motion, AnimatePresence, useInView } from "framer-motion";
import RevealOnView from "./RevealOnView";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

/* ─── Publication Data ─── */
const publications = [
  {
    id: 1,
    title: "Prediction and Management of Traffic Congestion in Urban Environments",
    authors: "Adish Padalia",
    venue: "IEEE Explore",
    venueFull: "IEEE Explore",
    year: 2024,
    tags: ["GRU", "SUMO", "V2I", "DSRC", "Traffic Prediction"],
    description:
      "Efficient urban traffic congestion management is paramount for ensuring smooth vehicular flow, minimizing travel time, and reducing environmental pollution. This paper presents an in-depth analysis of the \"Intelligent Intersection\" framework, a novel system designed to optimize traffic flow at intersections through advanced sensing, data processing, and control mechanisms. The research integrates the Gated Recurrent Unit (GRU) model for urban traffic prediction, Simulation of Urban Mobility (SUMO) for realistic traffic simulations, and adaptive traffic light control algorithms. Additionally, the integration of Vehicle-to-Infrastructure (V2I) communication, particularly Dedicated Short Range Communication (DSRC), facilitates efficient coordination between vehicles and infrastructure elements. Through comprehensive experimentation and evaluation, the effectiveness of this approach in mitigating traffic congestion, reducing travel time, and promoting sustainable transportation practices is demonstrated.",
    link: "https://ieeexplore.ieee.org/document/10724090",
    color: "#0db8ef",
    citations: 0,
    featured: false,
    previewImg: "/images/traffic-monitoring.png",
  },
  {
    id: 2,
    title: "Hybrid CNN and RNN for Twitter Sentiment Analysis",
    authors: "Adish Padalia",
    venue: "Springer",
    venueFull: "Springer Nature Singapore",
    year: 2024,
    tags: ["CNN", "RNN", "Sentiment Analysis", "NLP", "Deep Learning"],
    description:
      "Online social media networks have developed into a widespread and significant platform for people to freely express their thoughts and emotions in this era of digital communication. This paper attempts to forecast sentimental analysis based on Twitter user's tweets. We used a Twitter dataset which contains around 520k Tweets, to predict whether the tweet has a positive or a negative connotation. Using this dataset, we develop different deep learning models (including RNN and CNN). Finally, we suggested an approach that combines RNN and CNN to fully exploit each technology's advantages: RNN can learn temporal and context features, notably long-term dependency between multiple entities, while CNN is capable of catching numerous potential features. The result demonstrates that our method is superior to the majority of the existing methods.",
    link: "https://link.springer.com/chapter/10.1007/978-981-97-1326-4_25",
    color: "#f6bb48",
    citations: 0,
    featured: false,
    previewImg: "/images/twitter-sentiment-analysis.jpg",
  },
  {
    id: 3,
    title: "Enhancing Shift-Invariance for Accurate Brain MRI Skull-Stripping using Adaptive Polyphase Pooling in Modified U-Net",
    authors: "Adish Padalia",
    venue: "IEEE Xplore",
    venueFull: "IEEE Xplore",
    year: 2024,
    tags: [  "Medical Image Segmentation",
  "Computer Vision",
  "U-Net",
  "Adaptive Polyphase Pooling",
  "Shift-Invariant CNNs",
  "Deep Learning"],
    description:
      "Image segmentation is an essential aspect of image processing, where regions of interest (ROI) are identified by employing feature descriptors like edges, color, and texture. This study delves into supervised learning techniques to extract crucial brain features from non-brain tissues. The approach involves a modified U-net that operates on 2D slices of the brain MRI, yielding a skull-stripped image with superior accuracy compared to existing methods. The architecture incorporates Adaptive Polyphase Pooling layers, enhancing the architecture's robustness and the model's generalization. These Adaptive Polyphase Pooling layers ensure shift-invariance in the predicted output, maintaining consistency even if the single view of the Brain MRI shifts along the two axes in the plane.",
    link: "https://ieeexplore.ieee.org/document/10404359",
    color: "#68d391",
    citations: 0,
    featured: true,
    previewImg: "/images/brain-mri-publication.jpg",
  },
];


/* ═══════════════════════════════════════════
   Animated Counter
   ═══════════════════════════════════════════ */
const AnimatedCounter = ({ value, color, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      style={{ color, fontWeight: 800 }}
    >
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value}{suffix}
        </motion.span>
      ) : (
        "0"
      )}
    </motion.span>
  );
};

/* ═══════════════════════════════════════════
   Impact Bar — horizontal bar showing citation %
   ═══════════════════════════════════════════ */
const ImpactBar = ({ pub, maxCitations }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const pct = (pub.citations / maxCitations) * 100;

  return (
    <Box ref={ref} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.2 }}>
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "#8892b0",
          width: 60,
          textAlign: "right",
          flexShrink: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {pub.venue}
      </Typography>
      <Box sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{
            height: "100%",
            borderRadius: 3,
            background: `linear-gradient(90deg, ${pub.color}60, ${pub.color})`,
            boxShadow: `0 0 10px ${pub.color}40`,
          }}
        />
      </Box>
      <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: pub.color, width: 30, flexShrink: 0 }}>
        {pub.citations}
      </Typography>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   Featured Hero Card (top large card)
   ═══════════════════════════════════════════ */
const FeaturedCard = ({ pub }) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <RevealOnView delay={0.05}>
      <motion.a
        href={pub.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}
        whileTap={{ scale: 0.99 }}
      >
        <Box
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          sx={{
            position: "relative",
            borderRadius: "28px",
            overflow: "hidden",
            minHeight: { xs: 420, md: 380 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            border: `1.5px solid ${hovered ? pub.color + "50" : "rgba(255,255,255,0.06)"}`,
            bgcolor: "rgba(6,7,29,0.7)",
            backdropFilter: "blur(20px)",
            cursor: "pointer",
            transition: "all .45s cubic-bezier(.4,0,.2,1)",
            boxShadow: hovered
              ? `0 0 60px ${pub.color}15, 0 25px 70px rgba(0,0,0,0.45)`
              : "0 8px 40px rgba(0,0,0,0.3)",
            "&:hover": { transform: "translateY(-5px)" },
          }}
        >
          {/* Featured badge */}
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.5,
              py: 0.5,
              borderRadius: "999px",
              bgcolor: "rgba(4,5,21,0.85)",
              border: `1px solid ${pub.color}40`,
              backdropFilter: "blur(8px)",
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 13, color: pub.color }} />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: pub.color, letterSpacing: "0.5px" }}>
              FEATURED
            </Typography>
          </Box>

          {/* Image side */}
          <Box
            sx={{
              position: "relative",
              width: { xs: "100%", md: "50%" },
              minHeight: { xs: 200, md: "100%" },
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={pub.previewImg}
              alt={pub.title}
              onLoad={() => setImgLoaded(true)}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: imgLoaded ? (hovered ? 0.95 : 0.45) : 0,
                transition: "all .6s ease",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                filter: `saturate(${hovered ? 1 : 0.4}) brightness(0.5)`,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: {
                  xs: "linear-gradient(180deg, transparent 30%, rgba(6,7,29,0.98) 100%)",
                  md: `linear-gradient(90deg, transparent 20%, rgba(6,7,29,0.98) 95%)`,
                },
              }}
            />
            {/* Large watermark icon */}
            <Box sx={{ position: "absolute", bottom: 20, left: 20, opacity: 0.06 }}>
              <ArticleIcon sx={{ fontSize: 120, color: pub.color }} />
            </Box>
          </Box>

          {/* Content side */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, md: 4.5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
              zIndex: 2,
            }}
          >
            {/* Year + Venue */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 13, color: pub.color }} />
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: pub.color }}>{pub.year}</Typography>
              </Box>
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: pub.color, opacity: 0.75, fontStyle: "italic" }}>
                {pub.venueFull}
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontSize: { xs: "1.3rem", md: "1.6rem" },
                fontWeight: 800,
                color: hovered ? pub.color : "#e6f1ff",
                lineHeight: 1.3,
                transition: "color .35s",
              }}
            >
              {pub.title}
            </Typography>

            {/* Authors */}
            <Typography sx={{ fontSize: "0.88rem", color: "#a4b4cb", fontWeight: 500 }}>
              {pub.authors}
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: "#8892b0",
                lineHeight: 1.7,
                ...(expanded
                  ? {}
                  : {
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }),
              }}
            >
              {pub.description}
            </Typography>
            <Typography
              component="span"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              sx={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: pub.color,
                cursor: "pointer",
                opacity: 0.75,
                "&:hover": { opacity: 1 },
                transition: "opacity .2s",
                mt: -0.5,
              }}
            >
              {expanded ? "Show less" : "Read more..."}
            </Typography>

            {/* Tags */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              {pub.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: "0.73rem",
                    fontWeight: 600,
                    height: 28,
                    bgcolor: pub.color + "12",
                    color: pub.color,
                    border: `1px solid ${pub.color}20`,
                    borderRadius: "10px",
                  }}
                />
              ))}
            </Box>

            {/* Bottom row: citations + read */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
               { /*<FormatQuoteIcon sx={{ fontSize: 16, color: "#8892b0" }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#8892b0" }}>
                  {pub.citations} citations
                </Typography>*/}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.6,
                  opacity: hovered ? 1 : 0.5,
                  transition: "opacity .3s",
                }}
              >
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: pub.color }}>
                  Read Paper
                </Typography>
                <OpenInNewIcon sx={{ fontSize: 15, color: pub.color }} />
              </Box>
            </Box>
          </Box>

          {/* Animated border glow */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "3px",
              width: hovered ? "100%" : "0%",
              background: `linear-gradient(90deg, ${pub.color}, ${pub.color}50, transparent)`,
              transition: "width .7s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </Box>
      </motion.a>
    </RevealOnView>
  );
};

/* ═══════════════════════════════════════════
   Bento Grid Card (smaller cards)
   ═══════════════════════════════════════════ */
const BentoCard = ({ pub, index }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <RevealOnView delay={0.08 + index * 0.1}>
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setExpanded(false);
        }}
        onClick={() => setExpanded(!expanded)}
        sx={{
          position: "relative",
          borderRadius: "22px",
          overflow: "hidden",
          border: `1.5px solid ${hovered ? pub.color + "40" : "rgba(255,255,255,0.05)"}`,
          bgcolor: hovered ? "rgba(11,13,42,0.8)" : "rgba(11,13,42,0.4)",
          backdropFilter: "blur(16px)",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all .4s cubic-bezier(.4,0,.2,1)",
          boxShadow: hovered
            ? `0 0 30px ${pub.color}10, 0 16px 50px rgba(0,0,0,0.35)`
            : "0 4px 20px rgba(0,0,0,0.2)",
          "&:hover": { transform: "translateY(-4px)" },
        }}
      >
        {/* Preview image header */}
        <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
          <Box
            component="img"
            src={pub.previewImg}
            alt={pub.title}
            onLoad={() => setImgLoaded(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              opacity: imgLoaded ? (hovered ? 0.85 : 0.45) : 0,
              transition: "all .5s ease",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              filter: `saturate(${hovered ? 0.9 : 0.3}) brightness(0.45)`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 30%, rgba(11,13,42,0.98) 100%)",
            }}
          />

          {/* Year + Venue badges */}
          <Box sx={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 0.8 }}>
            <Box
              sx={{
                px: 1.2,
                py: 0.35,
                borderRadius: "8px",
                bgcolor: "rgba(4,5,21,0.8)",
                border: `1px solid ${pub.color}30`,
                backdropFilter: "blur(6px)",
              }}
            >
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: pub.color }}>{pub.year}</Typography>
            </Box>
            <Box
              sx={{
                px: 1.2,
                py: 0.35,
                borderRadius: "8px",
                bgcolor: "rgba(4,5,21,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: pub.color }}>{pub.venue}</Typography>
            </Box>
          </Box>

          {/* Citation badge top right */}
          <Box
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              display: "flex",
              alignItems: "center",
              gap: 0.3,
              px: 1,
              py: 0.35,
              borderRadius: "8px",
              bgcolor: "rgba(4,5,21,0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 2.5 }, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Title */}
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.02rem" },
              fontWeight: 700,
              color: hovered ? pub.color : "#e6f1ff",
              lineHeight: 1.4,
              mb: 1,
              transition: "color .3s",
              display: "-webkit-box",
              WebkitLineClamp: expanded ? 5 : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {pub.title}
          </Typography>

          {/* Authors */}
          <Typography
            sx={{
              fontSize: "0.78rem",
              color: "#8892b0",
              fontWeight: 500,
              mb: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {pub.authors}
          </Typography>

          {/* Description – always visible, clamped when collapsed */}
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#8892b0",
              lineHeight: 1.65,
              mb: 1.5,
              ...(expanded
                ? {}
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }),
            }}
          >
            {pub.description}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mb: 1.5 }}>
            {pub.tags.slice(0, expanded ? pub.tags.length : 2).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  height: 24,
                  bgcolor: pub.color + "0e",
                  color: pub.color + "cc",
                  border: `1px solid ${pub.color}18`,
                  borderRadius: "8px",
                }}
              />
            ))}
          </Box>

          {/* Bottom row */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto" }}>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#8892b0",
                fontWeight: 500,
              }}
            >
              {expanded ? "Click to collapse" : "Click to expand"}
            </Typography>
            <motion.a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 14px",
                borderRadius: 8,
                background: `${pub.color}15`,
                border: `1px solid ${pub.color}30`,
                color: pub.color,
                textDecoration: "none",
                fontSize: "0.78rem",
                fontWeight: 700,
                transition: "all .3s",
              }}
            >
              <OpenInNewIcon sx={{ fontSize: 13 }} />
              Read
            </motion.a>
          </Box>
        </Box>

        {/* Left accent */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "3px",
            height: hovered ? "100%" : "40%",
            background: `linear-gradient(180deg, ${pub.color}, transparent)`,
            transition: "height .5s cubic-bezier(.4,0,.2,1)",
            borderRadius: "0 3px 3px 0",
          }}
        />
      </Box>
    </RevealOnView>
  );
};

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
const Publications3 = () => {
  const featuredPub = publications.find((p) => p.featured);
  const otherPubs = publications.filter((p) => !p.featured);
  const maxCitations = Math.max(...publications.map((p) => p.citations));

  return (
    <Box
      id="publications"
      sx={{
        position: "relative",
        minHeight: "100vh",
        py: { xs: 8, md: 12 },
        bgcolor: "#040515",
        color: "#e6f1ff",
        overflow: "hidden",
      }}
    >
      {/* ─── Ambient effects ─── */}
      <Box
        sx={{
          position: "absolute",
          top: "5%",
          right: "-5%",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,184,239,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "-8%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(246,187,72,0.025) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Dot pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 3 }, position: "relative", zIndex: 1 }}>
        {/* ─── Header ─── */}
        <RevealOnView delay={0.01}>
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                px: 2,
                py: 0.6,
                borderRadius: "999px",
                border: "1px solid rgba(13,184,239,0.2)",
                bgcolor: "rgba(13,184,239,0.06)",
              }}
            >
              <MenuBookIcon sx={{ fontSize: 15, color: "#0db8ef" }} />
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#0db8ef",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Research Portfolio
              </Typography>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.8rem" },
                background: "linear-gradient(135deg, #e6f1ff 0%, #0db8ef 50%, #f6bb48 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1.5,
              }}
            >
              Publications
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.92rem", md: "1.02rem" },
                color: "#8892b0",
                maxWidth: 540,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              Peer-reviewed contributions to the frontiers of AI, Computer Vision, and Distributed Systems.
            </Typography>
          </Box>
        </RevealOnView>

        {/* ─── Featured Paper ─── */}
        {featuredPub && <FeaturedCard pub={featuredPub} />}

        {/* ─── Bento Grid ─── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: { xs: 2.5, md: 3 },
            mt: { xs: 3, md: 4 },
          }}
        >
          {otherPubs.map((pub, i) => (
            <BentoCard key={pub.id} pub={pub} index={i} />
          ))}
        </Box>

        {/* ─── Bottom CTA ─── */}
        <RevealOnView delay={0.3}>
          <Box sx={{ textAlign: "center", mt: { xs: 5, md: 7 } }}>
            <Typography sx={{ fontSize: "0.9rem", color: "#8892b0" }}>
              View all publications on{" "}
              <Box
                component="a"
                href="https://scholar.google.com/citations?user=spsQ3XsAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#0db8ef",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: "1px dashed #0db8ef50",
                  transition: "all .3s",
                  "&:hover": {
                    borderBottomColor: "#0db8ef",
                    textShadow: "0 0 12px rgba(13,184,239,0.3)",
                  },
                }}
              >
                Google Scholar →
              </Box>
            </Typography>
          </Box>
        </RevealOnView>
      </Box>
    </Box>
  );
};

export default Publications3;

