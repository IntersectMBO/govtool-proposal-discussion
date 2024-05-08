'use client';

import {
	ThemeProvider,
	createTheme,
	responsiveFontSizes,
} from '@mui/material/styles';
let theme = createTheme({
	palette: {
		primary: {
			main: '#0034AE',
		},
	},
});

theme = responsiveFontSizes(theme);

function ThemeProviderWrapper({ children }) {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeProviderWrapper;
