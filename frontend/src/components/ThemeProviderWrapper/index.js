'use client';

import {
	ThemeProvider,
	createTheme,
	responsiveFontSizes,
} from "@mui/material/styles";
import {Box} from "@mui/material";
import { Footer } from "@/components";
import { useEffect, useRef, useState } from "react";

let theme = createTheme({
	palette: {
		primary: {
			main: "#0034AE",
			icons: {
				black: "#212A3D",
				error: "#CC0000",
			},
		},
		text: {
			grey: "#506288",
			blueGrey: "#506288",
			darkPurple: "#242232",
			black: "#212A3D",
			orange: "#E76309"
		},
		border: {
			gray: "#E5DFE3",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
				},
			},
		},
	},
});

theme = responsiveFontSizes(theme);


function ThemeProviderWrapper({ children }) {
	const mobileNavRef = useRef();

	const [mobileNavHeight, setMobileNavHeight] = useState(0);
	const [windowWidth, setWindowWidth] = useState(0);

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
		<ThemeProvider theme={theme}>
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
						md: `20px 0 20px 0`,
					},
					overflow: "auto",
				}}
			>
				{children}
				<Footer sx={{ mt: "auto"}} />
			</Box>
		</ThemeProvider>);
}

export default ThemeProviderWrapper;
