import React from "react";
import { AppBar, Toolbar, Button, Stack, Typography, IconButton, Drawer, List, ListItemButton, ListItemText, useMediaQuery, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { Link, scroller } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import ScrollProgress from "./ScrollProgress";
const logo = process.env.PUBLIC_URL + "/assets/Logo.png";


const sections = [
	{ to: "home", label: "Home" },
	{ to: "about", label: "About" },
	{ to: "skills", label: "Skills" },
	{ to: "projects", label: "Projects" },
	{ to: "experience", label: "Experience" },
	{ to: "education", label: "Education" },
	{ to: "publications", label: "Publications" },
	{ to: "achievements", label: "Achievements" },
	{ to: "contact", label: "Contact" },
];

const Navbar = () => {
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
	const offset = isDesktop ? -80 : -64; // adjust for toolbar height on breakpoints
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	return (
		<AppBar
			position="fixed"
			elevation={0}
			sx={{
				top: 0,
				bgcolor: "rgba(4,5,21,0.6)",
				backdropFilter: "blur(100px)",
				borderBottom: "1px solid rgba(255,255,255,0.08)",
				overflow: "visible",
			}}
		>
			<Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }}>
				<motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, type: "spring", stiffness: 160 }}>
		    <Box
						component="img"
						src={logo}
						alt="AP"
						sx={{
							height: { xs: 60, md: 72 },
							width: "auto",
							display: "block",
							mixBlendMode: "screen",
						}}
					/>
				</motion.div>

			{/* Desktop links */}
			{isDesktop ? (
				<NavLinks sections={sections} offset={offset} />
			) : (
			<IconButton color="inherit" onClick={() => setDrawerOpen(true)} aria-label="open navigation menu" sx={{ mr: 2.5 }}>
					<MenuIcon />
				</IconButton>
			)}
			</Toolbar>
		{/* Mobile Drawer */}
		{!isDesktop && (
			<Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { bgcolor: "#0b0d2a", color: "#cfe8ff", width: 280 } }} ModalProps={{ keepMounted: true }}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.3 }}>Menu</Typography>
					<IconButton color="inherit" onClick={() => setDrawerOpen(false)} aria-label="close navigation menu" >
						<CloseIcon />
					</IconButton>
				</Toolbar>
				<List>
					{sections.map((s, idx) => (
						<motion.div key={s.to} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * idx }}>
							<ListItemButton
								sx={{ borderRadius: 1, mx: 1, mb: 0.5, 
									"&:hover": { backgroundColor: "rgba(13,184,239,0.12)" } }}
								onClick={() => {
									setDrawerOpen(false);
									// wait for drawer to start closing so layout settles
									setTimeout(() => {
									if (s.to === "contact") {
										window.dispatchEvent(new Event("contact:open"));
									}
										scroller.scrollTo(s.to, {
											duration: 800,
											smooth: "easeInOutQuart",
											offset,
										});
									}, 100);
								}}
							>
								<ListItemText primary={s.label} />
							</ListItemButton>
						</motion.div>
					))}
				</List>
			</Drawer>
		)}
			<ScrollProgress />
		</AppBar>
	);
};

export default Navbar;

	// Local component to keep file tidy
	const NavLinks = ({ sections, offset }) => {
		const [hovered, setHovered] = React.useState(null);
		const [active, setActive] = React.useState(null);
		return (
			<motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}>
				<Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ position: "relative" }}>
					{sections.map((s) => (
						<motion.div key={s.to} variants={{ hidden: { y: -12, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 18 } } }} onMouseEnter={() => setHovered(s.to)} onMouseLeave={() => setHovered(null)}>
							<Link to={s.to} smooth duration={800} offset={offset} activeClass="active" spy={true} onSetActive={() => setActive(s.to)} onSetInactive={() => setActive((prev) => (prev === s.to ? null : prev))} onClick={() => { if (s.to === "contact") { window.dispatchEvent(new Event("contact:open")); } }}>
				<Button
									color="inherit"
									size="small"
									sx={{
										textTransform: "none",
										fontWeight: 700,
					color: active === s.to || hovered === s.to ? "#ffffff" : "#cfe8ff",
					fontSize: { xs: "0.95rem", md: "1.05rem" },
										letterSpacing: 0.2,
										position: "relative",
										px: 1.25,
										borderRadius: 1,
										transition: "all .2s ease",
										"&:hover": { bgcolor: "rgba(13,184,239,0.12)" },
									}}
								>
									{s.label}
								</Button>
							</Link>
							<AnimatePresence>
								{(hovered === s.to || active === s.to) && (
									<motion.div
										layoutId="nav-underline"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										style={{ height: 2, borderRadius: 2, background: "linear-gradient(90deg,#0db8ef,#f6bb48)", marginTop: -6 }}
									/>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</Stack>
			</motion.div>
		);
	};
