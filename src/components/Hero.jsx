import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button, Typography, Box, Stack, IconButton } from "@mui/material";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-scroll";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";

const profileImg = process.env.PUBLIC_URL + "/profilePic.png";


const SOCIAL_LINKS = [
  { icon: LinkedInIcon, href: "https://www.linkedin.com/in/adish-padalia-a3768a230/", label: "LinkedIn" },
  { icon: EmailIcon, href: `mailto:${process.env.REACT_APP_EMAIL || "padaliaadish@gmail.com"}`, label: "Email" },
  { icon: GitHubIcon, href: "https://github.com/AdishPadalia26", label: "GitHub" },
  { icon: SchoolIcon, href: "https://scholar.google.com/citations?user=spsQ3XsAAAAJ&hl=en", label: "Google Scholar" },
];

const Hero = () => {
  const { scrollY } = useScroll();
  // Opacity goes from 0.7 at top to 0 once the user scrolls ~40px
  const hintOpacity = useTransform(scrollY, [0, 40], [0.7, 0]);

  const handleViewResume = () => {
    const resumeUrl = `${process.env.PUBLIC_URL}/resume.pdf`;
    // Open preview in a new tab
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
    // Trigger download as well
    try {
      const link = document.createElement("a");
      link.href = resumeUrl;
      link.download = "Adish_Padalia_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      // no-op: preview tab is still opened
    }
  };

  return (
  <Box
      sx={{
        height: "100vh",
        bgcolor: "#040515",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
    position: "relative",
      }}
  >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 140, damping: 16 }}
      >
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          spacing={{ xs: 4, md: 8 }}
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: { xs: "center", md: "center" } }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{ fontWeight: "900", mb: 1, fontSize: { xs: "2.5rem", md: "3.5rem" } }}
            >
              Hey,
            </Typography>

            <Typography
              variant="h3"
              sx={{ fontWeight: "900", mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}
            >
              I am{" "}
              <Box
                component="span"
                sx={{
                  color: "#f6bb48", // Casablanca highlight
                  fontWeight: "bold",
                }}
              >
                Adish Padalia
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 4,
                minHeight: "48px",
                fontSize: { xs: "1rem", md: "1.5rem" },
                color: "#0db8ef", // Neon blue typewriter color
                fontWeight: "500",
              }}
            >
              <Typewriter
                words={[
                  "Software Engineer",
                  "AI/ML Researcher",
                  "Full Stack Developer",
                  "Tech Innovator",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ width: "100%", maxWidth: 600 }}
            >
              <Button
                variant="contained"
                type="button"
                onClick={handleViewResume}
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#0db8ef",
                  ":hover": { bgcolor: "#0455ac" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                VIEW RESUME
              </Button>

              <Link
                to="contact"
                smooth={true}
                duration={500}
                onClick={() => {
                  window.dispatchEvent(new Event("contact:open"));
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    color: "#0db8ef",
                    borderColor: "#0db8ef",
                    fontWeight: "bold",
                    ":hover": {
                      bgcolor: "#0db8ef",
                      color: "white",
                      borderColor: "#0db8ef",
                    },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  CONTACT ME
                </Button>
              </Link>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:") ? undefined : "noopener noreferrer"
                  }
                  aria-label={label}
                  sx={{
                    color: "#0db8ef",
                    "&:hover": {
                      color: "#f6bb48",
                      bgcolor: "rgba(13, 184, 239, 0.12)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 28 }} />
                </IconButton>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              width: { xs: 180, sm: 220, md: 260 },
              height: { xs: 180, sm: 220, md: 260 },
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow:
                "0 0 0 4px rgba(13,184,239,0.4), 0 0 35px rgba(13,184,239,0.4)",
              background:
                "radial-gradient(circle at 30% 0%, #0db8ef33, transparent 60%)",
            }}
          >
            <Box
              component="img"
              src={profileImg}
              alt="Adish Padalia"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "translateY(4%)",
              }}
            />
          </Box>
          
        </Stack>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        style={{ position: "absolute", bottom: 24, opacity: hintOpacity, pointerEvents: "none" }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ color: "#0db8ef", fontSize: 18, letterSpacing: 1, textTransform: "uppercase" }}
        >
          Scroll
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default Hero;
