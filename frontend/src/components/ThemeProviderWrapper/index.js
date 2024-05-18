'use client';

import {
	ThemeProvider,
	alpha,
	createTheme,
	responsiveFontSizes,
} from '@mui/material/styles';

let theme = createTheme({
	palette: {
		primary: {
			main: '#0034AE',
			lightGray: '#F3F4F8',
			icons: {
				black: '#212A3D',
				error: '#CC0000',
			},
		},
		divider: {
			primary: '#B8CDFF',
		},
		badgeColors: {
			primary: '#0034AE',
			error: '#CC0000',
			errorLight: '#FF9999',
			secondary: '#39B6D5',
		},
		iconButton: {
			outlineLightColor: alpha('#BFC8D9', 0.38),
		},
		text: {
			grey: '#506288',
			darkPurple: '#242232',
			black: '#212A3D',
			orange: '#E76309',
		},
		border: {
			gray: '#E5DFE3',
			lightGray: '#CAC4D0',
		},
		button: {
			primary: '#3052F5',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
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
