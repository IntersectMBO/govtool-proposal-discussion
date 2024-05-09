'use client';

import {
	ThemeProvider,
	alpha,
	createTheme,
	responsiveFontSizes,
} from "@mui/material/styles";
let theme = createTheme({
	palette: {
		primary: {
			main: "#0034AE",
			icons: {
				black: "#212A3D",
				error: "#CC0000",
			},
		},
		badgeColors: {
			primary: "#0034AE",
			error: "#CC0000",
			errorLight: "#FF9999",
			secondary: "#39B6D5",
		},
		iconButton: {
			outlineLightColor: alpha("#BFC8D9", 0.38),
		},
		text: {
			grey: "#506288",
			darkPurple: "#242232",
			black: "#212A3D",
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
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeProviderWrapper;
