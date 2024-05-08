'use client';
import { Footer, Header, MobileNavbar, Sidebar } from "@/components";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const DefaultLayoutWrapper = ({ children }) => {
	const mobileNavRef = useRef();

	const [mobileNavHeight, setMobileNavHeight] = useState(0);
	const [windowWidth, setWindowWidth] = useState(0);

	const drawerWidth = 340;

	useEffect(() => {
		if (window) {
			setWindowWidth(window?.innerWidth);
		}
		const handleResize = () => {
			setWindowWidth(window?.innerWidth);
		};

		window?.addEventListener("resize", handleResize);

		return () => window?.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (mobileNavRef?.current) {
			// To set content height the right amount because of mobile navbar
			setMobileNavHeight(mobileNavRef?.current?.offsetHeight);
		}
	}, [mobileNavRef, windowWidth]);

	return (
		<Box>
			<Sidebar drawerWidth={drawerWidth} />

			<MobileNavbar ref={mobileNavRef} />

			<Box
				component="main"
				display={"flex"}
				flexDirection={"column"}
				flexGrow={1}
				sx={{
					p: 0,
					backgroundColor: (theme) =>
						theme.palette.background.default,
					height: {
						xs: `calc(100dvh - ${mobileNavHeight}px)`,
						md: "100dvh",
					},
					padding: {
						xs: `20px`,
						md: `20px 20px 20px ${drawerWidth + 40}px`,
					},

					overflow: "auto",
				}}
			>
				<Header />
				{children}
				<Footer sx={{ mt: "auto", pt: 4 }} />
			</Box>
		</Box>
	);
};

export default DefaultLayoutWrapper;
