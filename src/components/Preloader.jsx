import React from "react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
const logo = process.env.PUBLIC_URL + "/assets/Logo.png";


const Preloader = ({ loading }) => (
  <AnimatePresence>
    {loading && (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#040515",
        }}
      >
        {/* Ambient glow */}
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13,184,239,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Logo with pulse */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="AP"
            sx={{
              height: 90,
              width: "auto",
              mixBlendMode: "screen",
              filter: "drop-shadow(0 0 20px rgba(13,184,239,0.4))",
            }}
          />
        </motion.div>

        {/* Loading bar */}
        <Box
          sx={{
            mt: 4,
            width: 120,
            height: 3,
            borderRadius: 2,
            bgcolor: "rgba(13,184,239,0.1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: "50%",
              height: "100%",
              borderRadius: 4,
              background: "linear-gradient(90deg, transparent, #0db8ef, transparent)",
            }}
          />
        </Box>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Preloader;
