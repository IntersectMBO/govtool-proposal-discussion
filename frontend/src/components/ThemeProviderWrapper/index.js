'use client';

import {
	ThemeProvider,
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
