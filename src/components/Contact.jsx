import React from "react";
import { Box, Typography } from "@mui/material";
import RevealOnView from "./RevealOnView";
import ContactConsole from './ContactConsole';
import ContactBackground from './ContactBackground';

const Contact = () => (
	<Box id="contact" sx={{ position:'relative', minHeight: "100vh", py: { xs: 6, md: 10 }, bgcolor: "#040515", color: "#e6f1ff", overflow:'hidden' }}>
		<ContactBackground />
		<RevealOnView delay={0.01}>
			<Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: { xs: 3, md: 4 }, fontSize: { xs: "2rem", md: "2.5rem" } }}>
				Contact
			</Typography>
		</RevealOnView>
		<ContactConsole />
	</Box>
);

export default Contact;
