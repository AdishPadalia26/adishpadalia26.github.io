import React, { useRef, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import RevealOnView from "./RevealOnView";
import ExperienceTimeline3D from './ExperienceTimeline3D';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const EXPERIENCES = [
	{
		year: '2025',
		org: 'Rutgers University',
		role: 'Graduate Research Assistant',
		subtitle: 'Multimodal 3D Object Detection',
		location: 'New Jersey, USA',
		category: '💡 Computer Vision & 3D Perception',
		color: '#e879f9',
		bullets: [
			'Designed a multimodal 3D object detection pipeline fusing LiDAR and camera data, achieving a 25% improvement in 3D localization accuracy over 2D baseline models.',
			'Built a scalable auto-generation system for 3D bounding boxes (cuboids), reducing manual annotation and correction time by 40%.',
			'Implemented accurate 2D-to-3D geometric transformations using camera intrinsics and extrinsics, achieving 98% reprojection accuracy for real-world object mapping.',
		],
	},
	{
		year: '2024',
		org: 'Rutgers University',
		role: 'Teaching Assistant',
		subtitle: 'Computer Applications for Business, Database Management, Discrete Structures',
		location: 'New Jersey, USA',
		category: '💡 Mentorship & Academic Support',
		color: '#0db8ef',
		bullets: [
			'Mentored 200+ students in web development (HTML, CSS, JavaScript, SQL), Excel, Java, database management, set theory, and probability.',
			'Led weekly recitations & labs — simplified complex concepts, boosting average student performance by 15%.',
			'Graded & proctored assignments, midterms, and finals; achieved 95% positive feedback from students.',
		],
	},
	{
		year: '2023',
		org: 'IIT Bombay',
		role: 'Research Intern (with AIIMS New Delhi)',
		subtitle: null,
		location: 'Mumbai, India',
		category: '💡 AI for Medical Imaging',
		color: '#f6bb48',
		bullets: [
			'Reduced computational complexity of MRI segmentation from millions of parameters to 2K using Discrete Wavelet & Shearlet Transforms with a novel U-Net.',
			'Achieved 99% accuracy in 3D brain MRI skull-stripping & segmentation — outperforming state-of-the-art models.',
			'Developed the first Shearlet Transform library compatible with neural networks.',
			'Created an interactive live web tool for real-time MRI segmentation.',
		],
	},
	{
		year: '2022',
		org: 'AI-DL Virtual Labs – Sardar Patel Institute of Technology',
		role: 'Machine Learning Intern',
		subtitle: null,
		location: 'Mumbai, India',
		category: '💡 Interactive AI Learning Platforms',
		color: '#865120',
		bullets: [
			'Designed 10 structured ML/DL experiments with simulations & quizzes — including PoseNet-based human pose estimation and logistic regression for breast cancer prediction.',
			'Built & deployed a Flask + ReactJS full-stack virtual lab accessed by 400+ students remotely.',
		],
	},
	{
		year: '2022',
		org: 'AiM4u Software Solutions',
		role: 'Web Development Intern',
		subtitle: null,
		location: 'Mumbai, India',
		category: '💡 Full-Stack & API Integration',
		color: '#563c22',
		bullets: [
			'Enhanced UI using ReactJS, Chakra UI, Material-UI — improved client satisfaction scores by 20%.',
			'Integrated Flask backend with MongoDB, adding payment gateways, social media APIs, and Google AdSense.',
			'Improved website performance & responsiveness across devices.',
		],
	},
	{
		year: '2022',
		org: 'SP-TBI (S.P. Institute of Technology Business Incubator)',
		role: 'Frontend Developer Intern',
		subtitle: null,
		location: 'Mumbai, India',
		category: '💡 Frontend Engineering & UI Development',
		color: '#38bdf8',
		bullets: [
			'Developed responsive, pixel-perfect UI components using React.js and Material-UI, ensuring cross-browser compatibility and mobile-first design.',
			'Collaborated with the incubator\'s product team to translate Figma wireframes into production-ready frontend modules, reducing design-to-deployment turnaround by 30%.',
			'Implemented version control workflows using Git & GitHub, maintaining clean code standards and enabling seamless team collaboration.',
		],
	},
];

const Experience = () => {
	const scrollContainerRef = useRef(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [scrollRefReady, setScrollRefReady] = useState(false);

	useEffect(() => {
		if (scrollContainerRef.current) setScrollRefReady(true);
	}, []);

	const { scrollYProgress } = useScroll(
		scrollRefReady
			? { target: scrollContainerRef, offset: ["start start", "end end"] }
			: {}
	);

	useMotionValueEvent(scrollYProgress, "change", (v) => {
		const idx = Math.round(v * (EXPERIENCES.length - 1));
		setActiveIndex(clamp(idx, 0, EXPERIENCES.length - 1));
	});

	return (
		<Box ref={scrollContainerRef} sx={{ position: "relative", height: `${EXPERIENCES.length * 100}vh` }}>
			<Box
				id="experience"
				sx={{
					position: "sticky",
					top: 0,
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					bgcolor: "#06071d",
					color: "#e6f1ff",
					overflow: "hidden",
				}}
			>
				<Box sx={{ pt: { xs: 4, md: 6 } }}>
					<RevealOnView delay={0.01}>
						<Typography
							variant="h3"
							align="center"
							sx={{ fontWeight: 800, mb: { xs: 1, md: 2 }, fontSize: { xs: '2rem', md: '2.5rem' } }}
						>
							Experience
						</Typography>
					</RevealOnView>
				</Box>
				<Box sx={{ flex: 1, position: "relative" }}>
					<ExperienceTimeline3D experiences={EXPERIENCES} activeIndex={activeIndex} />
				</Box>
				{/* Scroll progress bar */}
				<Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, bgcolor: "rgba(255,255,255,0.05)" }}>
					<motion.div
						style={{
							height: "100%",
							background: "linear-gradient(90deg, #0db8ef, #f6bb48)",
							scaleX: scrollYProgress,
							transformOrigin: "left",
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default Experience;

